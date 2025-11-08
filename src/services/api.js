// Health Sathi API Service
// Frontend service to communicate with the backend API

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }

  // Appointments API
  async getAppointments() {
    return this.apiCall('/appointments');
  }

  async getAppointment(id) {
    return this.apiCall(`/appointments/${id}`);
  }

  async createAppointment(appointmentData) {
    return this.apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, appointmentData) {
    return this.apiCall(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id) {
    return this.apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  async getUpcomingAppointments() {
    return this.apiCall('/appointments/filter/upcoming');
  }

  // Medicines API
  async getMedicines() {
    return this.apiCall('/medicines');
  }

  async getMedicine(id) {
    return this.apiCall(`/medicines/${id}`);
  }

  async createMedicine(medicineData) {
    return this.apiCall('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData),
    });
  }

  async updateMedicine(id, medicineData) {
    return this.apiCall(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicineData),
    });
  }

  async deleteMedicine(id) {
    return this.apiCall(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  async markDoseTaken(id, doseData = {}) {
    return this.apiCall(`/medicines/${id}/dose`, {
      method: 'POST',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...doseData,
      }),
    });
  }

  async getActiveMedicines() {
    return this.apiCall('/medicines/filter/active');
  }

  async getMedicineReminders() {
    return this.apiCall('/medicines/filter/reminders');
  }

  // Documents API
  async getDocuments() {
    return this.apiCall('/documents');
  }

  async getDocument(id) {
    return this.apiCall(`/documents/${id}`);
  }

  async createDocument(documentData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(documentData).forEach(key => {
      if (key !== 'file' && documentData[key] !== undefined) {
        formData.append(key, documentData[key]);
      }
    });

    // Add file if present
    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    return this.apiCall('/documents', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async updateDocument(id, documentData) {
    return this.apiCall(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id) {
    return this.apiCall(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadDocument(id) {
    const url = `${this.baseURL}/documents/download/${id}`;
    window.open(url, '_blank');
  }

  async searchDocuments(searchParams) {
    const queryString = new URLSearchParams(searchParams).toString();
    return this.apiCall(`/documents/search?${queryString}`);
  }

  async getDocumentsByCategory(category) {
    return this.apiCall(`/documents/category/${category}`);
  }

  // Patient API
  async getPatient() {
    return this.apiCall('/patient');
  }

  async updatePatient(patientData) {
    return this.apiCall('/patient', {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async createPatient(patientData) {
    return this.apiCall('/patient', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async getPatientSummary() {
    return this.apiCall('/patient/summary');
  }

  // Health Data API
  async getDashboardData() {
    return this.apiCall('/health-data/dashboard');
  }

  async getVitals() {
    return this.apiCall('/health-data/vitals');
  }

  async recordVitals(vitalsData) {
    return this.apiCall('/health-data/vitals', {
      method: 'POST',
      body: JSON.stringify(vitalsData),
    });
  }

  async getHealthAnalytics(period = '30') {
    return this.apiCall(`/health-data/analytics?period=${period}`);
  }

  // Utility methods
  async testConnection() {
    try {
      const response = await this.healthCheck();
      console.log('✅ Backend connection successful:', response);
      return {
        connected: true,
        status: response.status,
        message: response.message
      };
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      
      // Provide specific error messages based on error type
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the server is running on port 5000.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Backend server is not running. Start it with: npm run server';
      } else if (error.message.includes('ERR_NETWORK')) {
        errorMessage = 'Network error. Check your internet connection and firewall settings.';
      }
      
      return {
        connected: false,
        error: errorMessage
      };
    }
  }

  // Batch operations
  async batchCreateAppointments(appointments) {
    const results = [];
    for (const appointment of appointments) {
      try {
        const result = await this.createAppointment(appointment);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    return results;
  }

  async batchCreateMedicines(medicines) {
    const results = [];
    for (const medicine of medicines) {
      try {
        const result = await this.createMedicine(medicine);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    return results;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Add some helper functions for common operations
export const api = {
  // Core API methods
  healthCheck: () => apiService.healthCheck(),
  testConnection: () => apiService.testConnection(),
  
  // Appointments
  getAppointments: () => apiService.getAppointments(),
  getAppointment: (id) => apiService.getAppointment(id),
  createAppointment: (data) => apiService.createAppointment(data),
  updateAppointment: (id, data) => apiService.updateAppointment(id, data),
  deleteAppointment: (id) => apiService.deleteAppointment(id),
  getUpcomingAppointments: () => apiService.getUpcomingAppointments(),
  
  // Medicines
  getMedicines: () => apiService.getMedicines(),
  getMedicine: (id) => apiService.getMedicine(id),
  createMedicine: (data) => apiService.createMedicine(data),
  updateMedicine: (id, data) => apiService.updateMedicine(id, data),
  deleteMedicine: (id) => apiService.deleteMedicine(id),
  markDoseTaken: (id, data) => apiService.markDoseTaken(id, data),
  getActiveMedicines: () => apiService.getActiveMedicines(),
  getMedicineReminders: () => apiService.getMedicineReminders(),
  
  // Documents
  getDocuments: () => apiService.getDocuments(),
  getDocument: (id) => apiService.getDocument(id),
  createDocument: (data) => apiService.createDocument(data),
  updateDocument: (id, data) => apiService.updateDocument(id, data),
  deleteDocument: (id) => apiService.deleteDocument(id),
  downloadDocument: (id) => apiService.downloadDocument(id),
  searchDocuments: (params) => apiService.searchDocuments(params),
  getDocumentsByCategory: (category) => apiService.getDocumentsByCategory(category),
  
  // Patient
  getPatient: () => apiService.getPatient(),
  updatePatient: (data) => apiService.updatePatient(data),
  createPatient: (data) => apiService.createPatient(data),
  getPatientSummary: () => apiService.getPatientSummary(),
  
  // Health Data
  getDashboardData: () => apiService.getDashboardData(),
  getVitals: () => apiService.getVitals(),
  recordVitals: (data) => apiService.recordVitals(data),
  getHealthAnalytics: (period) => apiService.getHealthAnalytics(period),
  
  // Batch operations
  batchCreateAppointments: (appointments) => apiService.batchCreateAppointments(appointments),
  batchCreateMedicines: (medicines) => apiService.batchCreateMedicines(medicines),
  
  // Quick helpers
  async quickScheduleAppointment(doctor, date, time, specialty = 'General Practice') {
    return apiService.createAppointment({
      doctor,
      date,
      time,
      specialty,
      location: 'Clinic',
      status: 'scheduled'
    });
  },

  async quickAddMedicine(name, dosage, frequency, times = []) {
    return apiService.createMedicine({
      name,
      dosage,
      frequency,
      times,
      active: true,
      reminderEnabled: true
    });
  },

  async quickAddDocument(name, type, file = null) {
    return apiService.createDocument({
      name,
      type,
      date: new Date().toISOString().split('T')[0],
      file
    });
  },

  // Error handling wrapper
  async safeCall(apiFunction, fallbackValue = null) {
    try {
      return await apiFunction();
    } catch (error) {
      console.warn('API call failed, using fallback:', error.message);
      return fallbackValue;
    }
  }
};

export default apiService;