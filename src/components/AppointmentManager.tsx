import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Clock, MapPin, User, Plus, Edit3, Trash2, Bell } from 'lucide-react';
import { Appointment } from '../App';
import { toast } from 'sonner@2.0.3';

interface AppointmentManagerProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export function AppointmentManager({ appointments, setAppointments }: AppointmentManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorName || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const appointmentData = {
      ...formData,
      id: editingAppointment?.id || Date.now().toString()
    };

    if (editingAppointment) {
      setAppointments(prev => 
        prev.map(apt => apt.id === editingAppointment.id ? appointmentData : apt)
      );
      toast.success('Appointment updated successfully');
      setEditingAppointment(null);
    } else {
      setAppointments(prev => [...prev, appointmentData]);
      toast.success('Appointment scheduled successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      notes: appointment.notes || ''
    });
    setEditingAppointment(appointment);
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    toast.success('Appointment deleted');
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    resetForm();
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const today = new Date();
  const upcomingAppointments = sortedAppointments.filter(apt => new Date(apt.date) >= today);
  const pastAppointments = sortedAppointments.filter(apt => new Date(apt.date) < today);

  const getDaysUntil = (date: string) => {
    const appointmentDate = new Date(date);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const AppointmentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="doctorName">Doctor Name *</Label>
          <Input
            id="doctorName"
            value={formData.doctorName}
            onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
            placeholder="Dr. John Smith"
            required
          />
        </div>
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={formData.specialty}
            onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
            placeholder="Cardiology, General Practice, etc."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Hospital or clinic name and address"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about the appointment"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
        </Button>
        {editingAppointment && (
          <Button type="button" variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const AppointmentCard = ({ appointment, isPast = false }: { appointment: Appointment; isPast?: boolean }) => {
    const daysUntil = getDaysUntil(appointment.date);
    
    return (
      <Card className={isPast ? 'opacity-75' : ''}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <h3>{appointment.doctorName}</h3>
                {appointment.specialty && (
                  <Badge variant="outline">{appointment.specialty}</Badge>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                {appointment.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{appointment.location}</span>
                  </div>
                )}
              </div>
              
              {appointment.notes && (
                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                  {appointment.notes}
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {!isPast && (
                <Badge variant={daysUntil <= 2 ? 'destructive' : daysUntil <= 7 ? 'default' : 'outline'}>
                  {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                </Badge>
              )}
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(appointment)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(appointment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Appointments</h2>
          <p className="text-gray-600">Manage your medical appointments and get reminders</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Add a new medical appointment to your calendar
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {editingAppointment && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Appointment</CardTitle>
            <CardDescription>Update your appointment details</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm />
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <div>
        <h3 className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          Upcoming Appointments ({upcomingAppointments.length})
        </h3>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-600 mb-2">No upcoming appointments</h4>
              <p className="text-gray-500">Schedule your next appointment to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            Past Appointments ({pastAppointments.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastAppointments.slice(0, 4).map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}