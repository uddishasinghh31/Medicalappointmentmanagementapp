import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Upload, Plus, Edit3, Trash2, Download, Eye, Search } from 'lucide-react';
import { MedicalDocument } from '../App';
import { toast } from 'sonner@2.0.3';

interface DocumentManagerProps {
  documents: MedicalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
}

export function DocumentManager({ documents, setDocuments }: DocumentManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<MedicalDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'prescription' | 'report' | 'scan' | 'other' | '',
    date: '',
    doctorName: '',
    notes: '',
    file: null as File | null
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '' as 'prescription' | 'report' | 'scan' | 'other' | '',
      date: '',
      doctorName: '',
      notes: '',
      file: null
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const documentData = {
      ...formData,
      id: editingDocument?.id || Date.now().toString(),
      type: formData.type as 'prescription' | 'report' | 'scan' | 'other'
    };

    if (editingDocument) {
      setDocuments(prev => 
        prev.map(doc => doc.id === editingDocument.id ? documentData : doc)
      );
      toast.success('Document updated successfully');
      setEditingDocument(null);
    } else {
      setDocuments(prev => [...prev, documentData]);
      toast.success('Document uploaded successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const handleEdit = (document: MedicalDocument) => {
    setFormData({
      name: document.name,
      type: document.type,
      date: document.date,
      doctorName: document.doctorName || '',
      notes: document.notes || '',
      file: document.file || null
    });
    setEditingDocument(document);
  };

  const handleDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success('Document deleted');
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return '💊';
      case 'report': return '📋';
      case 'scan': return '🔬';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'scan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DocumentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Document Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Blood Test Results"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Document Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="report">Medical Report</SelectItem>
              <SelectItem value="scan">Scan/Image</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="doctorName">Doctor Name</Label>
        <Input
          id="doctorName"
          value={formData.doctorName}
          onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
          placeholder="Dr. John Smith"
        />
      </div>

      <div>
        <Label htmlFor="file">Upload File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="cursor-pointer"
        />
        <p className="text-sm text-gray-500 mt-1">
          Supported formats: PDF, JPG, PNG, DOC, DOCX
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this document"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {editingDocument ? 'Update Document' : 'Upload Document'}
        </Button>
        {editingDocument && (
          <Button type="button" variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const DocumentCard = ({ document }: { document: MedicalDocument }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getTypeIcon(document.type)}</span>
              <h3 className="line-clamp-1">{document.name}</h3>
              <Badge className={getTypeColor(document.type)}>
                {document.type}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p>Date: {document.date}</p>
              {document.doctorName && (
                <p>Doctor: {document.doctorName}</p>
              )}
              {document.notes && (
                <p className="text-gray-500 line-clamp-2">Notes: {document.notes}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                toast.info('File preview would open here');
              }}
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                toast.info('File download would start here');
              }}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleEdit(document)}
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDelete(document.id)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {document.file && (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
            <Upload className="w-4 h-4" />
            <span>{document.file.name}</span>
            <span>({(document.file.size / 1024 / 1024).toFixed(1)} MB)</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2>Medical Documents</h2>
          <p className="text-gray-600">Store and organize your medical reports and documents</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Medical Document</DialogTitle>
              <DialogDescription>
                Add a new medical document to your records
              </DialogDescription>
            </DialogHeader>
            <DocumentForm />
          </DialogContent>
        </Dialog>
      </div>

      {editingDocument && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Document</CardTitle>
            <CardDescription>Update your document details</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentForm />
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="report">Medical Reports</SelectItem>
                <SelectItem value="scan">Scans/Images</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents ({sortedDocuments.length})
          </h3>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Showing results for "{searchTerm}"
            </p>
          )}
        </div>

        {sortedDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-600 mb-2">
                {searchTerm ? 'No documents found' : 'No documents uploaded'}
              </h4>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Upload your first medical document to get started'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDocuments.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </div>

      {/* Document Type Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
          <CardDescription>Overview of your document collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'prescription', label: 'Prescriptions', icon: '💊' },
              { type: 'report', label: 'Reports', icon: '📋' },
              { type: 'scan', label: 'Scans', icon: '🔬' },
              { type: 'other', label: 'Other', icon: '📄' }
            ].map(({ type, label, icon }) => {
              const count = documents.filter(doc => doc.type === type).length;
              return (
                <div key={type} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-2xl mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}