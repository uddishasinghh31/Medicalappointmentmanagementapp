import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, Pill, FileText, AlertCircle, CheckCircle, Download, Upload, Database, HardDrive, Stethoscope } from 'lucide-react';
import { Appointment, Medicine, MedicalDocument, PatientInfo } from '../App';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  appointments: Appointment[];
  medicines: Medicine[];
  documents: MedicalDocument[];
  patientInfo: PatientInfo;
  onNavigateToAppointments: () => void;
}

export function Dashboard({ appointments, medicines, documents, patientInfo, onNavigateToAppointments }: DashboardProps) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get today's medicines
  const todaysMedicines = medicines.filter(med => {
    const startDate = new Date(med.startDate);
    const endDate = new Date(med.endDate);
    return today >= startDate && today <= endDate;
  });

  // Get medicine schedule for today
  const getMedicineSchedule = () => {
    const schedule: { time: string; medicine: Medicine; taken: boolean }[] = [];
    
    todaysMedicines.forEach(medicine => {
      medicine.times.forEach(time => {
        const takenKey = `${todayStr}-${time}`;
        schedule.push({
          time,
          medicine,
          taken: medicine.taken?.[takenKey] || false
        });
      });
    });
    
    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const medicineSchedule = getMedicineSchedule();
  const takenCount = medicineSchedule.filter(item => item.taken).length;
  const totalCount = medicineSchedule.length;

  // Get recent documents
  const recentDocuments = documents
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const exportData = () => {
    try {
      const exportData = {
        appointments,
        medicines,
        documents: documents.map(doc => ({ ...doc, file: undefined })), // Remove file objects for export
        patientInfo,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `medicare-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target?.result as string);
            // In a real app, you would validate the data structure and update state
            toast.info('Data import feature would be implemented here');
          } catch (error) {
            toast.error('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">{patientInfo.name.charAt(0)}</span>
            </div>
            Welcome back, {patientInfo.name}!
          </CardTitle>
          <CardDescription>
            Here's your medical overview for today
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Medicines</p>
                <p className="text-2xl">{takenCount}/{totalCount}</p>
              </div>
              <Pill className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Status</p>
                <p className="text-sm text-green-600">Good</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Storage Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Data Storage & Backup
          </CardTitle>
          <CardDescription>
            Your data is stored locally in your browser and automatically saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <span>Stored in browser localStorage</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Auto-saves on every change</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span>Data persists between sessions</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={importData} variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white border rounded text-sm">
            <p className="text-gray-600">
              <strong>Note:</strong> Your data is stored locally in your browser. 
              It will persist between sessions but may be lost if you clear browser data. 
              For production use, consider connecting to a secure cloud database.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Large Cartoonish Doctor Sticker - Positioned prominently for elderly visibility */}
      <div className="flex justify-center my-8">
        <div className="relative group">
          {/* Large, prominent doctor sticker container - Made clickable */}
          <div 
            onClick={() => {
              onNavigateToAppointments();
              toast.success('Navigating to appointments!', {
                description: 'View and manage your upcoming appointments'
              });
            }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-emerald-200 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95 hover:border-emerald-300 group-hover:bg-gradient-to-br group-hover:from-emerald-100 group-hover:to-teal-100"
          >
            <div className="flex items-center gap-6">
              {/* Large doctor image */}
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1741894785509-d87c84bdc275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGRvY3RvciUyMG1hc2NvdCUyMG1lZGljYWwlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzU2MTE4MjA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Friendly doctor assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Large stethoscope badge */}
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-3 shadow-lg animate-pulse">
                  <Calendar className="w-6 h-6" />
                </div>
                
                {/* Floating hearts animation */}
                <div className="absolute -top-2 -left-2 text-red-400 animate-bounce">
                  <div className="text-2xl">💖</div>
                </div>
              </div>
              
              {/* Large, clear text for elderly users */}
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-emerald-700 tracking-wide">
                  Dr. Health Sathi
                </h3>
                <p className="text-xl text-emerald-600 leading-relaxed max-w-md">
                  Your friendly health companion is here to help you manage your appointments and medicines!
                </p>
                
                {/* Large, colorful speech bubble with click instruction */}
                <div className="bg-white border-3 border-emerald-300 rounded-2xl p-4 shadow-lg relative mt-4">
                  <p className="text-lg text-emerald-800 font-medium">
                    📅 Don't forget your upcoming appointments!<br/>
                    💊 Time for your medicines?<br/>
                    📋 Click me to view appointments! 
                  </p>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-emerald-300"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements for extra visibility */}
            <div className="absolute top-2 right-2 text-yellow-400 text-2xl animate-pulse">⭐</div>
            <div className="absolute bottom-2 left-2 text-blue-400 text-xl animate-bounce">🩺</div>
            <div className="absolute top-1/2 right-2 text-green-400 text-xl animate-pulse">💚</div>
            
            {/* Click indicator */}
            <div className="absolute top-4 left-4 bg-emerald-500 text-white rounded-full px-2 py-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
              CLICK ME!
            </div>
          </div>
          
          {/* Glowing border effect for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-sm opacity-30 -z-10"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments with Large Cartoonish Doctor Sticker */}
        <div className="relative">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                Your next scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map(appointment => {
                  const appointmentDate = new Date(appointment.date);
                  const daysUntil = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{appointment.doctorName}</h4>
                          <Badge variant="outline">{appointment.specialty}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.location}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={daysUntil <= 2 ? 'destructive' : 'default'}>
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Medicine Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Today's Medicine Schedule
            </CardTitle>
            <CardDescription>
              {takenCount} of {totalCount} medicines taken today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicineSchedule.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medicines scheduled for today</p>
            ) : (
              medicineSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {item.taken ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={item.taken ? 'line-through text-gray-500' : ''}>
                        {item.medicine.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.medicine.dosage} • {item.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.taken ? 'default' : 'outline'}>
                    {item.taken ? 'Taken' : 'Pending'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Documents
          </CardTitle>
          <CardDescription>
            Your latest medical documents and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDocuments.length === 0 ? (
              <p className="text-gray-500 text-center py-8 col-span-3">No documents uploaded</p>
            ) : (
              recentDocuments.map(document => (
                <div key={document.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <Badge variant="outline">{document.type}</Badge>
                  </div>
                  <h4 className="mb-1">{document.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{document.date}</p>
                  {document.doctorName && (
                    <p className="text-sm text-gray-500">{document.doctorName}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}