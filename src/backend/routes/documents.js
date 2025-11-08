// Documents API Routes
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'database', 'documents.json');
const uploadsPath = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
fs.ensureDirSync(uploadsPath);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `document-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, Word documents, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to read documents from database
const readDocuments = () => {
  try {
    return fs.readJsonSync(dbPath);
  } catch (error) {
    console.error('Error reading documents:', error);
    return [];
  }
};

// Helper function to write documents to database
const writeDocuments = (documents) => {
  try {
    fs.writeJsonSync(dbPath, documents, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error writing documents:', error);
    return false;
  }
};

// GET /api/documents - Get all documents
router.get('/', (req, res) => {
  try {
    const documents = readDocuments();
    
    // Sort documents by date (most recent first)
    const sortedDocuments = documents.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    res.json({
      success: true,
      data: sortedDocuments,
      count: documents.length,
      message: 'Documents retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve documents',
      message: error.message
    });
  }
});

// GET /api/documents/:id - Get single document
router.get('/:id', (req, res) => {
  try {
    const documents = readDocuments();
    const document = documents.find(doc => doc.id === req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: `No document found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: document,
      message: 'Document retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve document',
      message: error.message
    });
  }
});

// POST /api/documents - Create new document (with file upload)
router.post('/', upload.single('file'), (req, res) => {
  try {
    const { name, type, doctor, date, description, category, tags } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name and type are required'
      });
    }

    // Validate date if provided
    const documentDate = date || new Date().toISOString().split('T')[0];
    if (isNaN(new Date(documentDate).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
        message: 'Please provide a valid date'
      });
    }

    const documents = readDocuments();
    
    const newDocument = {
      id: uuidv4(),
      name: name.trim(),
      type: type.trim(),
      doctor: doctor?.trim() || '',
      date: documentDate,
      description: description?.trim() || '',
      category: category?.trim() || 'General',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      fileName: req.file ? req.file.filename : null,
      originalName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : null,
      mimeType: req.file ? req.file.mimetype : null,
      filePath: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    documents.push(newDocument);
    
    if (writeDocuments(documents)) {
      res.status(201).json({
        success: true,
        data: newDocument,
        message: 'Document created successfully'
      });
    } else {
      // If database write fails, delete uploaded file
      if (req.file) {
        fs.removeSync(req.file.path);
      }
      throw new Error('Failed to save document');
    }
  } catch (error) {
    // If error occurs, delete uploaded file
    if (req.file) {
      fs.removeSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create document',
      message: error.message
    });
  }
});

// PUT /api/documents/:id - Update document (without file)
router.put('/:id', (req, res) => {
  try {
    const documents = readDocuments();
    const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: `No document found with ID: ${req.params.id}`
      });
    }

    const { name, type, doctor, date, description, category, tags } = req.body;

    // Validate date if provided
    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
        message: 'Please provide a valid date'
      });
    }

    // Update document
    const updatedDocument = {
      ...documents[documentIndex],
      ...(name && { name: name.trim() }),
      ...(type && { type: type.trim() }),
      ...(doctor !== undefined && { doctor: doctor.trim() }),
      ...(date && { date }),
      ...(description !== undefined && { description: description.trim() }),
      ...(category && { category: category.trim() }),
      ...(tags !== undefined && { tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [] }),
      updatedAt: new Date().toISOString()
    };

    documents[documentIndex] = updatedDocument;
    
    if (writeDocuments(documents)) {
      res.json({
        success: true,
        data: updatedDocument,
        message: 'Document updated successfully'
      });
    } else {
      throw new Error('Failed to save updated document');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update document',
      message: error.message
    });
  }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', (req, res) => {
  try {
    const documents = readDocuments();
    const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: `No document found with ID: ${req.params.id}`
      });
    }

    const deletedDocument = documents.splice(documentIndex, 1)[0];
    
    // Delete associated file if it exists
    if (deletedDocument.fileName) {
      const filePath = path.join(uploadsPath, deletedDocument.fileName);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
      }
    }
    
    if (writeDocuments(documents)) {
      res.json({
        success: true,
        data: deletedDocument,
        message: 'Document deleted successfully'
      });
    } else {
      throw new Error('Failed to save after deletion');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete document',
      message: error.message
    });
  }
});

// GET /api/documents/download/:id - Download document file
router.get('/download/:id', (req, res) => {
  try {
    const documents = readDocuments();
    const document = documents.find(doc => doc.id === req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: `No document found with ID: ${req.params.id}`
      });
    }

    if (!document.fileName) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'This document does not have an associated file'
      });
    }

    const filePath = path.join(uploadsPath, document.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'The associated file could not be found on the server'
      });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to download file',
      message: error.message
    });
  }
});

// GET /api/documents/category/:category - Get documents by category
router.get('/category/:category', (req, res) => {
  try {
    const documents = readDocuments();
    const category = req.params.category;
    
    const categoryDocuments = documents
      .filter(doc => doc.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: categoryDocuments,
      count: categoryDocuments.length,
      category: category,
      message: `Documents in category "${category}" retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve documents by category',
      message: error.message
    });
  }
});

// GET /api/documents/search - Search documents
router.get('/search', (req, res) => {
  try {
    const { q, type, doctor, category } = req.query;
    const documents = readDocuments();
    
    let filteredDocuments = documents;
    
    // Text search
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by type
    if (type) {
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    // Filter by doctor
    if (doctor) {
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.doctor.toLowerCase().includes(doctor.toLowerCase())
      );
    }
    
    // Filter by category
    if (category) {
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort by date (most recent first)
    filteredDocuments.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: filteredDocuments,
      count: filteredDocuments.length,
      searchParams: { q, type, doctor, category },
      message: `Found ${filteredDocuments.length} documents matching your search`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search documents',
      message: error.message
    });
  }
});

module.exports = router;