import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { User, Edit3, Save, X, Plus, Trash2, Phone, AlertTriangle, Heart } from 'lucide-react';
import { PatientInfo } from '../App';
import { toast } from 'sonner@2.0.3';

interface PatientProfileProps {
  patientInfo: PatientInfo;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
}

export function PatientProfile({ patientInfo, setPatientInfo }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(patientInfo);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleSave = () => {
    if (!formData.name || !formData.age) {
      toast.error('Please fill in required fields');
      return;
    }

    setPatientInfo(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData(patientInfo);
    setIsEditing(false);
    setNewAllergy('');
    setNewCondition('');
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies?.filter((_, i) => i !== index) || []
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...(prev.conditions || []), newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Patient Profile</h2>
          <p className="text-gray-600">Manage your personal health information</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                disabled={!isEditing}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <Input
              id="bloodType"
              value={formData.bloodType || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
              disabled={!isEditing}
              placeholder="e.g., A+, B-, O+, AB-"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Allergies
            </CardTitle>
            <CardDescription>List your known allergies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.allergies?.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="flex items-center gap-1">
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => removeAllergy(index)}
                      className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              )) || <p className="text-gray-500 text-sm">No allergies recorded</p>}
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add new allergy"
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                />
                <Button onClick={addAllergy} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Medical Conditions
            </CardTitle>
            <CardDescription>Your current medical conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.conditions?.map((condition, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {condition}
                  {isEditing && (
                    <button
                      onClick={() => removeCondition(index)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              )) || <p className="text-gray-500 text-sm">No conditions recorded</p>}
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add new condition"
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                />
                <Button onClick={addCondition} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contact
          </CardTitle>
          <CardDescription>Person to contact in case of emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    name: e.target.value,
                    phone: prev.emergencyContact?.phone || ''
                  }
                }))}
                disabled={!isEditing}
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    name: prev.emergencyContact?.name || '',
                    phone: e.target.value
                  }
                }))}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
          <CardDescription>Quick overview of your health information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-2xl mb-1">{patientInfo.age}</div>
              <div className="text-sm text-gray-600">Years Old</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🩸</div>
              <div className="text-lg mb-1">{patientInfo.bloodType || 'N/A'}</div>
              <div className="text-sm text-gray-600">Blood Type</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-2xl mb-1">{patientInfo.allergies?.length || 0}</div>
              <div className="text-sm text-gray-600">Allergies</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🏥</div>
              <div className="text-2xl mb-1">{patientInfo.conditions?.length || 0}</div>
              <div className="text-sm text-gray-600">Conditions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="text-orange-800 mb-1">Important Privacy Notice</h4>
              <p className="text-sm text-orange-700">
                This application is for demonstration purposes only. For real medical data, 
                ensure you use HIPAA-compliant systems with proper security measures. 
                Never share sensitive medical information on unsecured platforms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}