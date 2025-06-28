import React, { useState } from 'react';
import { UserIcon, BuildingIcon, PhoneIcon, AtSignIcon, MapPinIcon, GlobeIcon, ImageIcon, BriefcaseIcon, HashIcon, TruckIcon, ShipIcon, LinkIcon, AnchorIcon, SettingsIcon, PlusIcon, FilterIcon, CheckIcon, AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
export interface UserMetadata {
  name: string;
  position: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}
export interface CompanyMetadata {
  name: string;
  address: string;
  website: string;
  logo: string;
  taxId: string;
}
// Equipment interfaces
interface EquipmentDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  expiryDate?: string;
}
interface BaseEquipment {
  id: string;
  name: string;
  type: string;
  image?: string;
  documents: EquipmentDocument[];
}
interface Vessel extends BaseEquipment {
  deckSpace: string;
  maxLoad: string;
  standards: string[];
}
interface Crane extends BaseEquipment {
  brand: string;
  model: string;
  capacity: string;
  boom: string;
  standards: string[];
}
interface TransportEquipment extends BaseEquipment {
  axles: number;
  maxLoad: string;
  standards: string[];
}
interface Sling extends BaseEquipment {
  wll: string;
  length: string;
  material: string;
  standards: string[];
}
interface Shackle extends BaseEquipment {
  wll: string;
  pinType: string;
  material: string;
  standards: string[];
}
type Equipment = Vessel | Crane | TransportEquipment | Sling | Shackle;
interface UserProfileProps {
  userMetadata: UserMetadata;
  companyMetadata: CompanyMetadata;
  onUpdateUserMetadata: (metadata: UserMetadata) => void;
  onUpdateCompanyMetadata: (metadata: CompanyMetadata) => void;
}
// Mock equipment data
const mockEquipment: Equipment[] = [{
  id: 'v1',
  name: 'Barge ABC-21',
  type: 'Flat-top',
  deckSpace: '85m × 24m',
  maxLoad: '4500t',
  standards: ['SOLAS', 'ISM'],
  documents: [{
    id: 'd1',
    name: 'Stability Calculations',
    type: 'pdf'
  }]
} as Vessel, {
  id: 'v2',
  name: 'MV Northern Star',
  type: 'Heavy Lift Vessel',
  deckSpace: '120m × 30m',
  maxLoad: '12000t',
  standards: ['SOLAS', 'ISM'],
  documents: []
} as Vessel, {
  id: 'c1',
  name: 'Liebherr LTM 1030-2.1',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 1030-2.1',
  capacity: '35t',
  boom: '30 m',
  standards: ['EN 13000'],
  documents: []
} as Crane, {
  id: 'c2',
  name: 'Grove GMK3060L-1',
  type: 'All-Terrain',
  brand: 'Grove',
  model: 'GMK3060L-1',
  capacity: '60t',
  boom: '48 m',
  standards: ['EN 13000'],
  documents: []
} as Crane, {
  id: 't1',
  name: 'Goldhofer 2+4',
  type: 'Hydraulic lowbed',
  axles: 6,
  maxLoad: '80t',
  standards: ['DOT', 'FMCSA'],
  documents: []
} as TransportEquipment, {
  id: 's1',
  name: 'Chain sling, 4-leg',
  type: 'Chain sling',
  wll: '20t',
  length: '3m',
  material: 'Grade 80 alloy steel',
  standards: ['EN 818'],
  documents: []
} as Sling, {
  id: 'sh1',
  name: 'Green Pin Bow Shackle 25t',
  type: 'Bow shackle',
  wll: '25t',
  pinType: 'Screw',
  material: 'Forged alloy steel',
  standards: ['EN 13889'],
  documents: []
} as Shackle];
export const UserProfile: React.FC<UserProfileProps> = ({
  userMetadata,
  companyMetadata,
  onUpdateUserMetadata,
  onUpdateCompanyMetadata
}) => {
  const [editingUser, setEditingUser] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [tempUserData, setTempUserData] = useState(userMetadata);
  const [tempCompanyData, setTempCompanyData] = useState(companyMetadata);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [activeEquipmentTab, setActiveEquipmentTab] = useState<string>('vessels');
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({
    vessels: true,
    cranes: false,
    transport: false,
    slings: false,
    shackles: false
  });
  const handleUserSave = () => {
    onUpdateUserMetadata(tempUserData);
    setEditingUser(false);
  };
  const handleCompanySave = () => {
    // In a real app, we would upload the logo file to a server
    // and get a URL back. For now, we'll just use the existing URL
    // or a placeholder if the logo file is selected
    const updatedCompanyData = {
      ...tempCompanyData,
      logo: logoFile ? URL.createObjectURL(logoFile) : tempCompanyData.logo
    };
    onUpdateCompanyMetadata(updatedCompanyData);
    setEditingCompany(false);
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  // Filter equipment by type
  const getEquipmentByType = (type: string) => {
    return mockEquipment.filter(item => {
      if (type === 'vessels' && 'deckSpace' in item) return true;
      if (type === 'cranes' && 'brand' in item) return true;
      if (type === 'transport' && 'axles' in item) return true;
      if (type === 'slings' && 'length' in item && 'material' in item) return true;
      if (type === 'shackles' && 'pinType' in item) return true;
      return false;
    });
  };
  // Get the appropriate icon for each equipment type
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'vessels':
        return <ShipIcon size={16} className="text-blue-500" />;
      case 'cranes':
        return <TruckIcon size={16} className="text-yellow-500" />;
      case 'transport':
        return <TruckIcon size={16} className="text-purple-500" />;
      case 'slings':
        return <LinkIcon size={16} className="text-green-500" />;
      case 'shackles':
        return <AnchorIcon size={16} className="text-orange-500" />;
      default:
        return <SettingsIcon size={16} className="text-gray-500" />;
    }
  };
  return <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserIcon size={20} className="text-gray-500" />
            <h3 className="font-medium text-gray-800">User Profile</h3>
          </div>
          <button onClick={() => setEditingUser(!editingUser)} className="text-sm text-blue-600 hover:text-blue-800">
            {editingUser ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="p-6">
          {editingUser ? <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input type="text" value={tempUserData.name} onChange={e => setTempUserData({
              ...tempUserData,
              name: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input type="text" value={tempUserData.position || ''} onChange={e => setTempUserData({
              ...tempUserData,
              position: e.target.value
            })} placeholder="e.g. Transport Engineer" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input type="text" value={tempUserData.phone} onChange={e => setTempUserData({
              ...tempUserData,
              phone: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input type="text" value={tempUserData.whatsapp} onChange={e => setTempUserData({
              ...tempUserData,
              whatsapp: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" value={tempUserData.email} onChange={e => setTempUserData({
              ...tempUserData,
              email: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input type="text" value={tempUserData.address} onChange={e => setTempUserData({
              ...tempUserData,
              address: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleUserSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div> : <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <UserIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{userMetadata.name}</span>
              </div>
              {userMetadata.position && <div className="flex items-center space-x-2">
                  <BriefcaseIcon size={16} className="text-gray-400" />
                  <span className="text-gray-800">{userMetadata.position}</span>
                </div>}
              <div className="flex items-center space-x-2">
                <PhoneIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{userMetadata.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AtSignIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{userMetadata.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{userMetadata.address}</span>
              </div>
            </div>}
        </div>
      </div>
      {/* Company Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BuildingIcon size={20} className="text-gray-500" />
            <h3 className="font-medium text-gray-800">Company Profile</h3>
          </div>
          <button onClick={() => setEditingCompany(!editingCompany)} className="text-sm text-blue-600 hover:text-blue-800">
            {editingCompany ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="p-6">
          {editingCompany ? <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input type="text" value={tempCompanyData.name} onChange={e => setTempCompanyData({
              ...tempCompanyData,
              name: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input type="text" value={tempCompanyData.address} onChange={e => setTempCompanyData({
              ...tempCompanyData,
              address: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input type="text" value={tempCompanyData.website} onChange={e => setTempCompanyData({
              ...tempCompanyData,
              website: e.target.value
            })} placeholder="https://www.example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax/VAT ID
                </label>
                <input type="text" value={tempCompanyData.taxId || ''} onChange={e => setTempCompanyData({
              ...tempCompanyData,
              taxId: e.target.value
            })} placeholder="e.g. TX-998456789" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {(tempCompanyData.logo || logoFile) && <div className="w-16 h-16 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                      <img src={logoFile ? URL.createObjectURL(logoFile) : tempCompanyData.logo} alt="Company Logo Preview" className="max-w-full max-h-full object-contain" />
                    </div>}
                  <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    {tempCompanyData.logo || logoFile ? 'Change Logo' : 'Upload Logo'}
                    <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleLogoChange} />
                  </label>
                  {(tempCompanyData.logo || logoFile) && <button type="button" onClick={() => {
                setLogoFile(null);
                setTempCompanyData({
                  ...tempCompanyData,
                  logo: ''
                });
              }} className="text-sm text-red-600 hover:text-red-800">
                      Remove
                    </button>}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Recommended: Square logo, at least 200x200px (JPG, PNG)
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleCompanySave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div> : <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BuildingIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{companyMetadata.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{companyMetadata.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeIcon size={16} className="text-gray-400" />
                <span className="text-gray-800">{companyMetadata.website}</span>
              </div>
              {companyMetadata.taxId && <div className="flex items-center space-x-2">
                  <HashIcon size={16} className="text-gray-400" />
                  <span className="text-gray-800">{companyMetadata.taxId}</span>
                </div>}
              {companyMetadata.logo && <div className="flex items-center space-x-2">
                  <ImageIcon size={16} className="text-gray-400" />
                  <div className="w-12 h-12 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={companyMetadata.logo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>}
            </div>}
        </div>
      </div>
      {/* Equipment Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={20} className="text-gray-500" />
            <h3 className="font-medium text-gray-800">Equipment Management</h3>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <PlusIcon size={16} className="mr-1" />
            Add Equipment
          </button>
        </div>
        <div className="p-6">
          <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
            <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeEquipmentTab === 'vessels' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveEquipmentTab('vessels')}>
              <ShipIcon size={16} />
              <span>Vessels</span>
            </button>
            <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeEquipmentTab === 'cranes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveEquipmentTab('cranes')}>
              <TruckIcon size={16} />
              <span>Cranes</span>
            </button>
            <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeEquipmentTab === 'transport' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveEquipmentTab('transport')}>
              <TruckIcon size={16} />
              <span>Transport</span>
            </button>
            <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeEquipmentTab === 'slings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveEquipmentTab('slings')}>
              <LinkIcon size={16} />
              <span>Slings</span>
            </button>
            <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeEquipmentTab === 'shackles' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveEquipmentTab('shackles')}>
              <AnchorIcon size={16} />
              <span>Shackles</span>
            </button>
          </div>
          {/* Equipment List */}
          <div className="space-y-4">
            {/* Vessels Section */}
            <div className={`${activeEquipmentTab === 'vessels' ? 'block' : 'hidden'}`}>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex">
                  <div className="w-1/3 font-medium text-gray-700 text-sm">
                    Name
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Type
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Deck Space
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Max Load
                  </div>
                  <div className="w-1/10 font-medium text-gray-700 text-sm">
                    Status
                  </div>
                </div>
                {getEquipmentByType('vessels').map((vessel: any) => <div key={vessel.id} className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-1/3 flex items-center">
                      <ShipIcon size={16} className="text-blue-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {vessel.name}
                      </span>
                    </div>
                    <div className="w-1/5">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {vessel.type}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">
                      {vessel.deckSpace}
                    </div>
                    <div className="w-1/5 text-gray-600">{vessel.maxLoad}</div>
                    <div className="w-1/10">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Cranes Section */}
            <div className={`${activeEquipmentTab === 'cranes' ? 'block' : 'hidden'}`}>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex">
                  <div className="w-1/3 font-medium text-gray-700 text-sm">
                    Name
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Brand/Model
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Type
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Capacity
                  </div>
                  <div className="w-1/10 font-medium text-gray-700 text-sm">
                    Status
                  </div>
                </div>
                {getEquipmentByType('cranes').map((crane: any) => <div key={crane.id} className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-1/3 flex items-center">
                      <TruckIcon size={16} className="text-yellow-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {crane.name}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">
                      {crane.brand} {crane.model}
                    </div>
                    <div className="w-1/5">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {crane.type}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">{crane.capacity}</div>
                    <div className="w-1/10">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Transport Section */}
            <div className={`${activeEquipmentTab === 'transport' ? 'block' : 'hidden'}`}>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex">
                  <div className="w-1/3 font-medium text-gray-700 text-sm">
                    Name
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Type
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Axles
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Max Load
                  </div>
                  <div className="w-1/10 font-medium text-gray-700 text-sm">
                    Status
                  </div>
                </div>
                {getEquipmentByType('transport').map((transport: any) => <div key={transport.id} className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-1/3 flex items-center">
                      <TruckIcon size={16} className="text-purple-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {transport.name}
                      </span>
                    </div>
                    <div className="w-1/5">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transport.type}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">{transport.axles}</div>
                    <div className="w-1/5 text-gray-600">
                      {transport.maxLoad}
                    </div>
                    <div className="w-1/10">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Slings Section */}
            <div className={`${activeEquipmentTab === 'slings' ? 'block' : 'hidden'}`}>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex">
                  <div className="w-1/3 font-medium text-gray-700 text-sm">
                    Name
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Type
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    WLL
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Material
                  </div>
                  <div className="w-1/10 font-medium text-gray-700 text-sm">
                    Status
                  </div>
                </div>
                {getEquipmentByType('slings').map((sling: any) => <div key={sling.id} className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-1/3 flex items-center">
                      <LinkIcon size={16} className="text-green-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {sling.name}
                      </span>
                    </div>
                    <div className="w-1/5">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {sling.type}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">{sling.wll}</div>
                    <div className="w-1/5 text-gray-600">{sling.material}</div>
                    <div className="w-1/10">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Shackles Section */}
            <div className={`${activeEquipmentTab === 'shackles' ? 'block' : 'hidden'}`}>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex">
                  <div className="w-1/3 font-medium text-gray-700 text-sm">
                    Name
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Type
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    WLL
                  </div>
                  <div className="w-1/5 font-medium text-gray-700 text-sm">
                    Material
                  </div>
                  <div className="w-1/10 font-medium text-gray-700 text-sm">
                    Status
                  </div>
                </div>
                {getEquipmentByType('shackles').map((shackle: any) => <div key={shackle.id} className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-1/3 flex items-center">
                      <AnchorIcon size={16} className="text-orange-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {shackle.name}
                      </span>
                    </div>
                    <div className="w-1/5">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {shackle.type}
                      </span>
                    </div>
                    <div className="w-1/5 text-gray-600">{shackle.wll}</div>
                    <div className="w-1/5 text-gray-600">
                      {shackle.material}
                    </div>
                    <div className="w-1/10">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* No equipment message */}
            {getEquipmentByType(activeEquipmentTab).length === 0 && <div className="text-center py-8 border border-gray-200 rounded-md">
                <SettingsIcon size={36} className="mx-auto text-gray-300 mb-3" />
                <h4 className="text-gray-700 font-medium mb-1">
                  No {activeEquipmentTab} found
                </h4>
                <p className="text-gray-500 text-sm mb-4">
                  You haven't added any {activeEquipmentTab} to your profile
                  yet.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center mx-auto">
                  <PlusIcon size={16} className="mr-1" />
                  Add {activeEquipmentTab.slice(0, -1)}
                </button>
              </div>}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {getEquipmentByType(activeEquipmentTab).length}{' '}
              {activeEquipmentTab} available
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center">
                <FilterIcon size={14} className="mr-1" />
                Filter
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center">
                <PlusIcon size={14} className="mr-1" />
                Add {activeEquipmentTab.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};