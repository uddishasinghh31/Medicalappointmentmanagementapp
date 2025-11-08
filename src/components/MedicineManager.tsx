import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Pill, Plus, Edit3, Trash2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Medicine } from '../App';
import { toast } from 'sonner@2.0.3';

interface MedicineManagerProps {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

export function MedicineManager({ medicines, setMedicines }: MedicineManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: [''],
    startDate: '',
    endDate: '',
    instructions: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      times: [''],
      startDate: '',
      endDate: '',
      instructions: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.times.some(time => !time)) {
      toast.error('Please set all reminder times');
      return;
    }

    const medicineData = {
      ...formData,
      id: editingMedicine?.id || Date.now().toString(),
      taken: editingMedicine?.taken || {}
    };

    if (editingMedicine) {
      setMedicines(prev => 
        prev.map(med => med.id === editingMedicine.id ? medicineData : med)
      );
      toast.success('Medicine updated successfully');
      setEditingMedicine(null);
    } else {
      setMedicines(prev => [...prev, medicineData]);
      toast.success('Medicine added successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      times: medicine.times,
      startDate: medicine.startDate,
      endDate: medicine.endDate,
      instructions: medicine.instructions || ''
    });
    setEditingMedicine(medicine);
  };

  const handleDelete = (medicineId: string) => {
    setMedicines(prev => prev.filter(med => med.id !== medicineId));
    toast.success('Medicine deleted');
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
    resetForm();
  };

  const handleFrequencyChange = (frequency: string) => {
    setFormData(prev => {
      let times: string[] = [];
      switch (frequency) {
        case 'Once daily':
          times = ['08:00'];
          break;
        case 'Twice daily':
          times = ['08:00', '20:00'];
          break;
        case 'Three times daily':
          times = ['08:00', '13:00', '20:00'];
          break;
        case 'Four times daily':
          times = ['08:00', '12:00', '16:00', '20:00'];
          break;
        case 'Every 6 hours':
          times = ['06:00', '12:00', '18:00', '00:00'];
          break;
        case 'Every 8 hours':
          times = ['08:00', '16:00', '00:00'];
          break;
        case 'As needed':
          times = [''];
          break;
        default:
          times = [''];
      }
      return { ...prev, frequency, times };
    });
  };

  const handleTimeChange = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '']
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const markAsTaken = (medicineId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const takenKey = `${today}-${time}`;
    
    setMedicines(prev =>
      prev.map(med =>
        med.id === medicineId
          ? {
              ...med,
              taken: { ...med.taken, [takenKey]: true }
            }
          : med
      )
    );
    toast.success('Marked as taken!');
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const activeMedicines = medicines.filter(med => {
    const startDate = new Date(med.startDate);
    const endDate = new Date(med.endDate);
    return today >= startDate && today <= endDate;
  });

  const expiredMedicines = medicines.filter(med => {
    const endDate = new Date(med.endDate);
    return today > endDate;
  });

  const MedicineForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Medicine Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Lisinopril"
            required
          />
        </div>
        <div>
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 10mg"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={formData.frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Once daily">Once daily</SelectItem>
            <SelectItem value="Twice daily">Twice daily</SelectItem>
            <SelectItem value="Three times daily">Three times daily</SelectItem>
            <SelectItem value="Four times daily">Four times daily</SelectItem>
            <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
            <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
            <SelectItem value="As needed">As needed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Reminder Times</Label>
        <div className="space-y-2">
          {formData.times.map((time, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="flex-1"
              />
              {formData.times.length > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addTimeSlot}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="e.g., Take with food, before meals, etc."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
        </Button>
        {editingMedicine && (
          <Button type="button" variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const MedicineCard = ({ medicine, isExpired = false }: { medicine: Medicine; isExpired?: boolean }) => {
    const todaySchedule = medicine.times.map(time => {
      const takenKey = `${todayStr}-${time}`;
      return {
        time,
        taken: medicine.taken?.[takenKey] || false
      };
    });

    const takenCount = todaySchedule.filter(item => item.taken).length;
    const totalCount = todaySchedule.length;

    return (
      <Card className={isExpired ? 'opacity-75' : ''}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <h3>{medicine.name}</h3>
                <Badge variant="outline">{medicine.dosage}</Badge>
                {isExpired && <Badge variant="destructive">Expired</Badge>}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{medicine.frequency}</p>
              
              {medicine.instructions && (
                <p className="text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded">
                  {medicine.instructions}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {medicine.startDate} - {medicine.endDate}
                </span>
                {!isExpired && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {takenCount}/{totalCount} today
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEdit(medicine)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDelete(medicine.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isExpired && (
            <div className="space-y-2">
              <h4 className="text-sm">Today's Schedule:</h4>
              <div className="grid grid-cols-2 gap-2">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.time}</span>
                    {item.taken ? (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Taken
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsTaken(medicine.id, item.time)}
                        className="text-xs h-6"
                      >
                        Mark Taken
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Medicine Management</h2>
          <p className="text-gray-600">Track your medications and get timely reminders</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>
                Set up a new medication with reminder times
              </DialogDescription>
            </DialogHeader>
            <MedicineForm />
          </DialogContent>
        </Dialog>
      </div>

      {editingMedicine && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Medicine</CardTitle>
            <CardDescription>Update your medication details</CardDescription>
          </CardHeader>
          <CardContent>
            <MedicineForm />
          </CardContent>
        </Card>
      )}

      {/* Active Medicines */}
      <div>
        <h3 className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5" />
          Active Medicines ({activeMedicines.length})
        </h3>
        {activeMedicines.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-600 mb-2">No active medicines</h4>
              <p className="text-gray-500">Add your medications to get started with reminders</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeMedicines.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>

      {/* Expired Medicines */}
      {expiredMedicines.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" />
            Expired Medicines ({expiredMedicines.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {expiredMedicines.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} isExpired />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}