import React, { useState } from 'react';
import { SearchIcon, FilterIcon, CheckIcon, PlusIcon, ShipIcon, TruckIcon, AnchorIcon, LinkIcon, SettingsIcon, ImageIcon, FileTextIcon, CheckCircleIcon, XIcon, InfoIcon, UploadIcon } from 'lucide-react';
// Equipment types
export interface BaseEquipment {
  id: string;
  name: string;
  type: string;
  image?: string;
  documents: EquipmentDocument[];
}
export interface Vessel extends BaseEquipment {
  deckSpace: string;
  maxLoad: string;
  standards: string[];
}
export interface Crane extends BaseEquipment {
  brand: string;
  model: string;
  category: string;
  capacity: string;
  boom: string;
  maxHeight: string;
  axlesBase: string;
  power: string;
  keyFeatures: string;
  standards: string[];
}
export interface TransportEquipment extends BaseEquipment {
  axles: number;
  maxLoad: string;
  specs: string;
  standards: string[];
}
export interface Sling extends BaseEquipment {
  wll: string;
  length: string;
  material: string;
  safetyFactor: string;
  standards: string[];
}
export interface Shackle extends BaseEquipment {
  wll: string;
  pinType: string;
  material: string;
  standards: string[];
}
export interface EquipmentDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  expiryDate?: string;
}
export type Equipment = Vessel | Crane | TransportEquipment | Sling | Shackle;
interface EquipmentLibraryProps {
  onSelectEquipment: (equipment: Equipment) => void;
}
// Mock data for equipment library
const mockVessels: Vessel[] = [{
  id: 'v1',
  name: 'Barge ABC-21',
  type: 'Flat-top',
  deckSpace: '85m × 24m',
  maxLoad: '4500t',
  standards: ['SOLAS', 'ISM', 'IMDG'],
  documents: [{
    id: 'd1',
    name: 'Stability Calculations',
    type: 'pdf'
  }, {
    id: 'd2',
    name: 'Marine Certificate',
    type: 'pdf',
    expiryDate: '2024-06-30'
  }, {
    id: 'd3',
    name: 'Load Plan Template',
    type: 'pdf'
  }]
}, {
  id: 'v2',
  name: 'MV Northern Star',
  type: 'Heavy Lift Vessel',
  deckSpace: '120m × 30m',
  maxLoad: '12000t',
  standards: ['SOLAS', 'ISM', 'IMDG'],
  documents: [{
    id: 'd4',
    name: 'Vessel Specifications',
    type: 'pdf'
  }, {
    id: 'd5',
    name: 'Classification Certificate',
    type: 'pdf',
    expiryDate: '2023-12-15'
  }]
}, {
  id: 'v3',
  name: 'Pontoon P-42',
  type: 'Modular Pontoon',
  deckSpace: '42m × 12m',
  maxLoad: '1200t',
  standards: ['SOLAS'],
  documents: [{
    id: 'd6',
    name: 'Assembly Manual',
    type: 'pdf'
  }, {
    id: 'd7',
    name: 'Load Test Certificate',
    type: 'pdf',
    expiryDate: '2024-03-22'
  }]
}];
const mockCranes: Crane[] = [
// All-Terrain Cranes
{
  id: 'c1',
  name: 'Liebherr LTM 1030-2.1',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 1030-2.1',
  category: 'All-Terrain',
  capacity: '35t',
  boom: '30 m',
  maxHeight: '44 m',
  axlesBase: '2 axles',
  power: 'Diesel',
  keyFeatures: 'Compact city AT',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd8',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd9',
    name: 'Annual Inspection',
    type: 'pdf',
    expiryDate: '2023-11-30'
  }]
}, {
  id: 'c2',
  name: 'Liebherr LTM 1055-3.1',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 1055-3.1',
  category: 'All-Terrain',
  capacity: '55t',
  boom: '40.5 m',
  maxHeight: '62 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'High reach',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd10',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd11',
    name: 'Operator Manual',
    type: 'pdf'
  }]
}, {
  id: 'c3',
  name: 'Liebherr LTM 1160-5.2',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 1160-5.2',
  category: 'All-Terrain',
  capacity: '180t',
  boom: '62 m',
  maxHeight: '99 m',
  axlesBase: '5 axles',
  power: 'Diesel',
  keyFeatures: 'ECOmode',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd12',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd13',
    name: 'Maintenance Schedule',
    type: 'pdf'
  }]
}, {
  id: 'c4',
  name: 'Liebherr LTM 1650-8.1',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 1650-8.1',
  category: 'All-Terrain',
  capacity: '700t',
  boom: '80 / 66 m',
  maxHeight: '151 m',
  axlesBase: '8 axles',
  power: 'Diesel',
  keyFeatures: 'Superlift Y-guy',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd14',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd15',
    name: 'Assembly Procedure',
    type: 'pdf'
  }]
}, {
  id: 'c5',
  name: 'Liebherr LTM 11200-9.1',
  type: 'All-Terrain',
  brand: 'Liebherr',
  model: 'LTM 11200-9.1',
  category: 'All-Terrain',
  capacity: '1200t',
  boom: '100 m',
  maxHeight: '188 m',
  axlesBase: '9 axles',
  power: 'Diesel',
  keyFeatures: 'Longest telescopic',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd16',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd17',
    name: 'Technical Specifications',
    type: 'pdf'
  }]
}, {
  id: 'c6',
  name: 'Grove GMK3060L-1',
  type: 'All-Terrain',
  brand: 'Grove',
  model: 'GMK3060L-1',
  category: 'All-Terrain',
  capacity: '60t',
  boom: '48 m',
  maxHeight: '65 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'Single-cab AT',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd18',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd19',
    name: 'Inspection Certificate',
    type: 'pdf',
    expiryDate: '2024-03-15'
  }]
}, {
  id: 'c7',
  name: 'Grove GMK4090',
  type: 'All-Terrain',
  brand: 'Grove',
  model: 'GMK4090',
  category: 'All-Terrain',
  capacity: '90t',
  boom: '51 m',
  maxHeight: '75 m',
  axlesBase: '4 axles',
  power: 'Diesel',
  keyFeatures: 'MEGATRAK suspension',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd20',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd21',
    name: 'Maintenance Log',
    type: 'pdf'
  }]
}, {
  id: 'c8',
  name: 'Grove GMK6300L-1',
  type: 'All-Terrain',
  brand: 'Grove',
  model: 'GMK6300L-1',
  category: 'All-Terrain',
  capacity: '300t',
  boom: '80 m',
  maxHeight: '120 m',
  axlesBase: '6 axles',
  power: 'Diesel',
  keyFeatures: 'Wind-ready',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd22',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd23',
    name: 'Wind Speed Calculations',
    type: 'pdf'
  }]
}, {
  id: 'c9',
  name: 'Demag AC 160-5',
  type: 'All-Terrain',
  brand: 'Demag',
  model: 'AC 160-5',
  category: 'All-Terrain',
  capacity: '160t',
  boom: '68 m',
  maxHeight: '95 m',
  axlesBase: '5 axles',
  power: 'Diesel',
  keyFeatures: 'Mobile long boom',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd24',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd25',
    name: 'Inspection Report',
    type: 'pdf',
    expiryDate: '2024-02-10'
  }]
},
// Rough Terrain Cranes
{
  id: 'c10',
  name: 'Grove RT9130E-2',
  type: 'Rough Terrain',
  brand: 'Grove',
  model: 'RT9130E-2',
  category: 'Rough Terrain',
  capacity: '120t',
  boom: '48.8 m',
  maxHeight: '80 m',
  axlesBase: '4WD',
  power: 'Diesel',
  keyFeatures: 'Heavy-lift RT',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd26',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd27',
    name: 'Terrain Guide',
    type: 'pdf'
  }]
}, {
  id: 'c11',
  name: 'Tadano GR-1200XL-3',
  type: 'Rough Terrain',
  brand: 'Tadano',
  model: 'GR-1200XL-3',
  category: 'Rough Terrain',
  capacity: '120t',
  boom: '47 m',
  maxHeight: '75 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'City/RT combo',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd28',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd29',
    name: 'Operator Manual',
    type: 'pdf'
  }]
}, {
  id: 'c12',
  name: 'Terex RT 90',
  type: 'Rough Terrain',
  brand: 'Terex',
  model: 'RT 90',
  category: 'Rough Terrain',
  capacity: '90t',
  boom: '47 m',
  maxHeight: '68 m',
  axlesBase: '4WD',
  power: 'Diesel',
  keyFeatures: 'Extreme conditions',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd30',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd31',
    name: 'Maintenance Schedule',
    type: 'pdf'
  }]
},
// Truck-Mounted Cranes
{
  id: 'c13',
  name: 'Grove TMS700E',
  type: 'Truck-Mounted',
  brand: 'Grove',
  model: 'TMS700E',
  category: 'Truck-Mounted',
  capacity: '55t',
  boom: '33 m',
  maxHeight: '51 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'Cost efficient',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd32',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd33',
    name: 'Road Compliance Cert',
    type: 'pdf',
    expiryDate: '2024-05-20'
  }]
}, {
  id: 'c14',
  name: 'Manitex 30112S',
  type: 'Truck-Mounted',
  brand: 'Manitex',
  model: '30112S',
  category: 'Truck-Mounted',
  capacity: '30t',
  boom: '34 m',
  maxHeight: '48 m',
  axlesBase: '2 axles',
  power: 'Diesel',
  keyFeatures: 'Telescoping',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd34',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd35',
    name: 'Highway Permit',
    type: 'pdf',
    expiryDate: '2023-12-31'
  }]
},
// Compact / City Cranes
{
  id: 'c15',
  name: 'Liebherr LTC 1045-3.1',
  type: 'Compact / City',
  brand: 'Liebherr',
  model: 'LTC 1045-3.1',
  category: 'Compact / City',
  capacity: '45t',
  boom: '36 m',
  maxHeight: '50 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'LiftCab setup',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd36',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd37',
    name: 'Urban Operation Guide',
    type: 'pdf'
  }]
}, {
  id: 'c16',
  name: 'Demag AC 45 City',
  type: 'Compact / City',
  brand: 'Demag',
  model: 'AC 45 City',
  category: 'Compact / City',
  capacity: '45t',
  boom: '31.2 m',
  maxHeight: '44 m',
  axlesBase: '3 axles',
  power: 'Diesel',
  keyFeatures: 'Urban city crane',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd38',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd39',
    name: 'City Operation Manual',
    type: 'pdf'
  }]
},
// Pick & Carry Cranes
{
  id: 'c17',
  name: 'Franna AT-22',
  type: 'Pick & Carry',
  brand: 'Franna',
  model: 'AT-22',
  category: 'Pick & Carry',
  capacity: '22t',
  boom: '17 m',
  maxHeight: '28 m',
  axlesBase: '2 axles',
  power: 'Diesel',
  keyFeatures: 'Aussie plant-use',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd40',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd41',
    name: 'Inspection Certificate',
    type: 'pdf',
    expiryDate: '2024-01-15'
  }]
}, {
  id: 'c18',
  name: 'Tadano TR-200M',
  type: 'Pick & Carry',
  brand: 'Tadano',
  model: 'TR-200M',
  category: 'Pick & Carry',
  capacity: '20t',
  boom: '28 m',
  maxHeight: '42 m',
  axlesBase: '2 axles',
  power: 'Diesel',
  keyFeatures: 'City agile',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd42',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd43',
    name: 'Operation Manual',
    type: 'pdf'
  }]
},
// Crawler Cranes
{
  id: 'c19',
  name: 'Manitowoc 16000',
  type: 'Crawler',
  brand: 'Manitowoc',
  model: '16000',
  category: 'Crawler',
  capacity: '440t',
  boom: '96 m',
  maxHeight: '144 m',
  axlesBase: 'Crawler',
  power: 'Diesel',
  keyFeatures: 'MAX‑ER wind kit',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd44',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd45',
    name: 'Assembly Manual',
    type: 'pdf'
  }]
}, {
  id: 'c20',
  name: 'Manitowoc MLC300',
  type: 'Crawler',
  brand: 'Manitowoc',
  model: 'MLC300',
  category: 'Crawler',
  capacity: '300t',
  boom: '96 m',
  maxHeight: '132 m',
  axlesBase: 'Crawler',
  power: 'Diesel',
  keyFeatures: 'VPC system',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd46',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd47',
    name: 'VPC Setup Guide',
    type: 'pdf'
  }]
}, {
  id: 'c21',
  name: 'Liebherr LR 1300',
  type: 'Crawler',
  brand: 'Liebherr',
  model: 'LR 1300',
  category: 'Crawler',
  capacity: '300t',
  boom: '98 m',
  maxHeight: '161 m',
  axlesBase: 'Crawler',
  power: 'Diesel',
  keyFeatures: 'High civil',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd48',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd49',
    name: 'Inspection Report',
    type: 'pdf',
    expiryDate: '2024-04-10'
  }]
}, {
  id: 'c22',
  name: 'Kobelco CKE1350G-2',
  type: 'Crawler',
  brand: 'Kobelco',
  model: 'CKE1350G-2',
  category: 'Crawler',
  capacity: '135t',
  boom: '76.2 m',
  maxHeight: '91.4 m',
  axlesBase: 'Crawler',
  power: 'Diesel',
  keyFeatures: 'Container work',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd50',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd51',
    name: 'Technical Specifications',
    type: 'pdf'
  }]
},
// Port Cranes
{
  id: 'c23',
  name: 'Liebherr LHM 550',
  type: 'Port – MHC',
  brand: 'Liebherr',
  model: 'LHM 550',
  category: 'Port – MHC',
  capacity: '144t',
  boom: '54 m',
  maxHeight: '55 m',
  axlesBase: 'Rubber‑tire',
  power: 'Diesel-electric',
  keyFeatures: 'Multi‑use',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd52',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd53',
    name: 'Port Operations Manual',
    type: 'pdf'
  }]
}, {
  id: 'c24',
  name: 'Konecranes ESP 7',
  type: 'Port – MHC',
  brand: 'Konecranes',
  model: 'ESP 7',
  category: 'Port – MHC',
  capacity: '150t',
  boom: '51 m',
  maxHeight: '55 m',
  axlesBase: 'Rubber‑tire',
  power: 'Hybrid',
  keyFeatures: 'Regenerative energy',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd54',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd55',
    name: 'Energy Efficiency Report',
    type: 'pdf'
  }]
}, {
  id: 'c25',
  name: 'Italgru TGS 1400B',
  type: 'Port – MHC',
  brand: 'Italgru',
  model: 'TGS 1400B',
  category: 'Port – MHC',
  capacity: '140t',
  boom: '48 m',
  maxHeight: '50 m',
  axlesBase: 'Rubber‑tire',
  power: 'Diesel',
  keyFeatures: 'General cargo',
  standards: ['EN 13000', 'ASME B30.5'],
  documents: [{
    id: 'd56',
    name: 'Load Chart',
    type: 'pdf'
  }, {
    id: 'd57',
    name: 'Maintenance Schedule',
    type: 'pdf'
  }]
}];
const mockTransport: TransportEquipment[] = [{
  id: 't1',
  name: 'Goldhofer 2+4',
  type: 'Hydraulic lowbed',
  axles: 6,
  maxLoad: '80t',
  specs: 'Bed height 850mm, gooseneck 1.3m',
  standards: ['DOT', 'FMCSA'],
  documents: [{
    id: 'd15',
    name: 'Configuration Drawing',
    type: 'pdf'
  }, {
    id: 'd16',
    name: 'Tire Load Table',
    type: 'pdf'
  }]
}, {
  id: 't2',
  name: 'Scheuerle SPMT 4x6',
  type: 'Self-propelled modular transporter',
  axles: 24,
  maxLoad: '240t',
  specs: '24 axle lines, hydraulic suspension',
  standards: ['ISO 668', 'CE'],
  documents: [{
    id: 'd17',
    name: 'Operating Manual',
    type: 'pdf'
  }, {
    id: 'd18',
    name: 'Load Distribution Calc',
    type: 'pdf'
  }]
}, {
  id: 't3',
  name: 'Faymonville MegaMAX',
  type: 'Semi-trailer',
  axles: 4,
  maxLoad: '65t',
  specs: 'Extendable to 21m, hydraulic steering',
  standards: ['DOT', 'CE'],
  documents: [{
    id: 'd19',
    name: 'Technical Specifications',
    type: 'pdf'
  }, {
    id: 'd20',
    name: 'Maintenance Schedule',
    type: 'pdf'
  }]
}];
const mockSlings: Sling[] = [{
  id: 's1',
  name: 'Chain sling, 4-leg',
  type: 'Chain sling',
  wll: '20t',
  length: '3m',
  material: 'Grade 80 alloy steel',
  safetyFactor: '4:1',
  standards: ['EN 818', 'ASME B30.9'],
  documents: [{
    id: 'd21',
    name: 'Test Certificate',
    type: 'pdf',
    expiryDate: '2024-01-15'
  }, {
    id: 'd22',
    name: 'Inspection Log',
    type: 'pdf'
  }]
}, {
  id: 's2',
  name: 'Nylon slings 12t',
  type: 'Synthetic sling',
  wll: '12t',
  length: '8m',
  material: 'Polyester',
  safetyFactor: '7:1',
  standards: ['EN 1492', 'ASME B30.9'],
  documents: [{
    id: 'd23',
    name: 'Manufacturer Certificate',
    type: 'pdf'
  }, {
    id: 'd24',
    name: 'Inspection Record',
    type: 'pdf',
    expiryDate: '2023-12-10'
  }]
}, {
  id: 's3',
  name: 'Wire rope sling, 2-leg',
  type: 'Wire rope sling',
  wll: '16t',
  length: '5m',
  material: 'Galvanized steel',
  safetyFactor: '5:1',
  standards: ['EN 13414', 'ASME B30.9'],
  documents: [{
    id: 'd25',
    name: 'Load Test Report',
    type: 'pdf',
    expiryDate: '2024-04-05'
  }, {
    id: 'd26',
    name: 'Usage Guidelines',
    type: 'pdf'
  }]
}];
const mockShackles: Shackle[] = [{
  id: 'sh1',
  name: 'Green Pin Bow Shackle 25t',
  type: 'Bow shackle',
  wll: '25t',
  pinType: 'Screw',
  material: 'Forged alloy steel',
  standards: ['EN 13889', 'ASME B30.26'],
  documents: [{
    id: 'd27',
    name: 'Test Certificate',
    type: 'pdf'
  }, {
    id: 'd28',
    name: 'CE Certificate',
    type: 'pdf'
  }]
}, {
  id: 'sh2',
  name: 'Crosby G-2130 Shackle',
  type: 'Bolt type anchor shackle',
  wll: '35t',
  pinType: 'Bolt',
  material: 'Carbon steel',
  standards: ['ASME B30.26', 'CE'],
  documents: [{
    id: 'd29',
    name: 'Material Certificate',
    type: 'pdf'
  }, {
    id: 'd30',
    name: 'Inspection Report',
    type: 'pdf',
    expiryDate: '2024-07-20'
  }]
}, {
  id: 'sh3',
  name: 'Van Beest Straight Shackle',
  type: 'Straight shackle',
  wll: '15t',
  pinType: 'Screw',
  material: 'Forged alloy steel',
  standards: ['EN 13889', 'DNV-GL'],
  documents: [{
    id: 'd31',
    name: 'Proof Load Test',
    type: 'pdf'
  }, {
    id: 'd32',
    name: 'Traceability Certificate',
    type: 'pdf'
  }]
}];
export const EquipmentLibrary: React.FC<EquipmentLibraryProps> = ({
  onSelectEquipment
}) => {
  const [activeCategory, setActiveCategory] = useState<'vessels' | 'cranes' | 'transport' | 'slings' | 'shackles'>('vessels');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [craneCategory, setCraneCategory] = useState<string | null>(null);
  // Get all standards for filtering
  const getAllStandards = () => {
    const standards = new Set<string>();
    [...mockVessels, ...mockCranes, ...mockTransport, ...mockSlings, ...mockShackles].forEach(equipment => {
      equipment.standards.forEach(standard => standards.add(standard));
    });
    return Array.from(standards).sort();
  };
  // Get all crane categories for filtering
  const getCraneCategories = () => {
    const categories = new Set<string>();
    mockCranes.forEach(crane => {
      categories.add(crane.category);
    });
    return Array.from(categories).sort();
  };
  // Get current equipment list based on active category
  const getCurrentEquipmentList = () => {
    switch (activeCategory) {
      case 'vessels':
        return mockVessels;
      case 'cranes':
        return mockCranes;
      case 'transport':
        return mockTransport;
      case 'slings':
        return mockSlings;
      case 'shackles':
        return mockShackles;
      default:
        return [];
    }
  };
  // Filter equipment based on search, selected standard, and crane category
  const filteredEquipment = getCurrentEquipmentList().filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase()) || activeCategory === 'cranes' && ((item as Crane).brand?.toLowerCase().includes(searchTerm.toLowerCase()) || (item as Crane).model?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStandard = selectedStandard ? item.standards.includes(selectedStandard) : true;
    const matchesCraneCategory = activeCategory === 'cranes' && craneCategory ? (item as Crane).category === craneCategory : true;
    return matchesSearch && matchesStandard && matchesCraneCategory;
  });
  // Handle equipment selection
  const handleSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment.id);
    onSelectEquipment(equipment);
  };
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vessels':
        return <ShipIcon size={20} className="text-blue-500" />;
      case 'cranes':
        return <TruckIcon size={20} className="text-yellow-500" />;
      case 'transport':
        return <TruckIcon size={20} className="text-purple-500" />;
      case 'slings':
        return <LinkIcon size={20} className="text-green-500" />;
      case 'shackles':
        return <AnchorIcon size={20} className="text-orange-500" />;
      default:
        return <SettingsIcon size={20} className="text-gray-500" />;
    }
  };
  // Check if any document is expired or expiring soon
  const getDocumentStatus = (documents: EquipmentDocument[]) => {
    if (!documents.length) return null;
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    const hasExpired = documents.some(doc => {
      if (!doc.expiryDate) return false;
      return new Date(doc.expiryDate) < now;
    });
    if (hasExpired) return 'expired';
    const isExpiringSoon = documents.some(doc => {
      if (!doc.expiryDate) return false;
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate > now && expiryDate < thirtyDaysFromNow;
    });
    if (isExpiringSoon) return 'expiring';
    return 'valid';
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Equipment Library
          </h3>
          <button onClick={() => setShowAddNew(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
            <PlusIcon size={16} />
            <span>Add Equipment</span>
          </button>
        </div>
        <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
          <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeCategory === 'vessels' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory('vessels')}>
            <ShipIcon size={16} />
            <span>Vessels</span>
          </button>
          <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeCategory === 'cranes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory('cranes')}>
            <TruckIcon size={16} />
            <span>Cranes</span>
          </button>
          <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeCategory === 'transport' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory('transport')}>
            <TruckIcon size={16} />
            <span>Transport</span>
          </button>
          <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeCategory === 'slings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory('slings')}>
            <LinkIcon size={16} />
            <span>Slings</span>
          </button>
          <button className={`py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 ${activeCategory === 'shackles' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveCategory('shackles')}>
            <AnchorIcon size={16} />
            <span>Shackles</span>
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={`Search ${activeCategory}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          {activeCategory === 'cranes' ? <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={craneCategory || ''} onChange={e => setCraneCategory(e.target.value || null)}>
                <option value="">All Crane Types</option>
                {getCraneCategories().map(category => <option key={category} value={category}>
                    {category}
                  </option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FilterIcon size={18} className="text-gray-400" />
              </div>
            </div> : <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedStandard || ''} onChange={e => setSelectedStandard(e.target.value || null)}>
                <option value="">All Standards</option>
                {getAllStandards().map(standard => <option key={standard} value={standard}>
                    {standard}
                  </option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FilterIcon size={18} className="text-gray-400" />
              </div>
            </div>}
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-md">
          {activeCategory === 'vessels' && <div className="flex bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="w-1/4 font-medium text-gray-700">Vessel</div>
              <div className="w-1/6 font-medium text-gray-700">Type</div>
              <div className="w-1/6 font-medium text-gray-700">Deck Space</div>
              <div className="w-1/6 font-medium text-gray-700">Max Load</div>
              <div className="w-1/6 font-medium text-gray-700">Standards</div>
              <div className="w-1/6 font-medium text-gray-700">Documents</div>
            </div>}
          {activeCategory === 'cranes' && <div className="flex bg-gray-50 border-b border-gray-200 px-4 py-3 text-xs">
              <div className="w-1/6 font-medium text-gray-700">Brand/Model</div>
              <div className="w-1/8 font-medium text-gray-700">Type</div>
              <div className="w-1/8 font-medium text-gray-700">Capacity</div>
              <div className="w-1/8 font-medium text-gray-700">Boom</div>
              <div className="w-1/8 font-medium text-gray-700">Max Height</div>
              <div className="w-1/8 font-medium text-gray-700">Axles/Base</div>
              <div className="w-1/8 font-medium text-gray-700">Power</div>
              <div className="w-2/8 font-medium text-gray-700">
                Key Features
              </div>
            </div>}
          {activeCategory === 'transport' && <div className="flex bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="w-1/4 font-medium text-gray-700">Transport</div>
              <div className="w-1/6 font-medium text-gray-700">Type</div>
              <div className="w-1/6 font-medium text-gray-700">Axles</div>
              <div className="w-1/6 font-medium text-gray-700">Max Load</div>
              <div className="w-1/6 font-medium text-gray-700">Standards</div>
              <div className="w-1/6 font-medium text-gray-700">Documents</div>
            </div>}
          {activeCategory === 'slings' && <div className="flex bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="w-1/4 font-medium text-gray-700">Sling</div>
              <div className="w-1/6 font-medium text-gray-700">Type</div>
              <div className="w-1/6 font-medium text-gray-700">WLL</div>
              <div className="w-1/6 font-medium text-gray-700">Length</div>
              <div className="w-1/6 font-medium text-gray-700">Standards</div>
              <div className="w-1/6 font-medium text-gray-700">Documents</div>
            </div>}
          {activeCategory === 'shackles' && <div className="flex bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="w-1/4 font-medium text-gray-700">Shackle</div>
              <div className="w-1/6 font-medium text-gray-700">Type</div>
              <div className="w-1/6 font-medium text-gray-700">WLL</div>
              <div className="w-1/6 font-medium text-gray-700">Pin Type</div>
              <div className="w-1/6 font-medium text-gray-700">Standards</div>
              <div className="w-1/6 font-medium text-gray-700">Documents</div>
            </div>}
          <div className="max-h-96 overflow-y-auto">
            {filteredEquipment.length > 0 ? filteredEquipment.map(item => {
            const documentStatus = getDocumentStatus(item.documents);
            if (activeCategory === 'cranes') {
              const crane = item as Crane;
              return <div key={crane.id} className={`flex items-center px-4 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer text-xs ${selectedEquipment === crane.id ? 'bg-blue-50' : ''}`} onClick={() => handleSelect(crane as Equipment)}>
                      <div className="w-1/6 font-medium text-gray-800 flex items-center">
                        {getCategoryIcon(activeCategory)}
                        <div className="ml-2">
                          <div>
                            {crane.brand} {crane.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            {crane.name}
                          </div>
                        </div>
                      </div>
                      <div className="w-1/8">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {crane.category}
                        </span>
                      </div>
                      <div className="w-1/8 text-gray-600">
                        {crane.capacity}
                      </div>
                      <div className="w-1/8 text-gray-600">{crane.boom}</div>
                      <div className="w-1/8 text-gray-600">
                        {crane.maxHeight}
                      </div>
                      <div className="w-1/8 text-gray-600">
                        {crane.axlesBase}
                      </div>
                      <div className="w-1/8 text-gray-600">{crane.power}</div>
                      <div className="w-2/8 text-gray-600">
                        {crane.keyFeatures}
                        {documentStatus === 'expired' && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                            Docs Expired
                          </span>}
                        {documentStatus === 'expiring' && <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                            Docs Expiring
                          </span>}
                      </div>
                    </div>;
            } else {
              // Original rendering for other equipment types
              return <div key={item.id} className={`flex items-center px-6 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${selectedEquipment === item.id ? 'bg-blue-50' : ''}`} onClick={() => handleSelect(item as Equipment)}>
                      <div className="w-1/4 font-medium text-gray-800 flex items-center">
                        {getCategoryIcon(activeCategory)}
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <div className="w-1/6 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.type}
                        </span>
                      </div>
                      {activeCategory === 'vessels' && <>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Vessel).deckSpace}
                          </div>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Vessel).maxLoad}
                          </div>
                        </>}
                      {activeCategory === 'transport' && <>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as TransportEquipment).axles}
                          </div>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as TransportEquipment).maxLoad}
                          </div>
                        </>}
                      {activeCategory === 'slings' && <>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Sling).wll}
                          </div>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Sling).length}
                          </div>
                        </>}
                      {activeCategory === 'shackles' && <>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Shackle).wll}
                          </div>
                          <div className="w-1/6 text-sm text-gray-600">
                            {(item as Shackle).pinType}
                          </div>
                        </>}
                      <div className="w-1/6 flex flex-wrap gap-1">
                        {item.standards.map((standard, index) => <span key={index} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {standard}
                          </span>)}
                      </div>
                      <div className="w-1/6 flex items-center">
                        <span className="text-xs mr-1">
                          {item.documents.length} docs
                        </span>
                        {documentStatus === 'expired' && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                            Expired
                          </span>}
                        {documentStatus === 'expiring' && <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                            Expiring
                          </span>}
                      </div>
                    </div>;
            }
          }) : <div className="p-6 text-center text-gray-500">
                No equipment found matching your criteria
              </div>}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {filteredEquipment.length} items found
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2" onClick={() => {
        if (filteredEquipment.length > 0 && selectedEquipment) {
          const selected = filteredEquipment.find(e => e.id === selectedEquipment);
          if (selected) {
            onSelectEquipment(selected as Equipment);
          }
        }
      }} disabled={!selectedEquipment}>
          <CheckIcon size={18} />
          <span>Use Selected Equipment</span>
        </button>
      </div>
      {/* Add New Equipment Modal */}
      {showAddNew && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-800">
                Add New Equipment
              </h3>
              <button onClick={() => setShowAddNew(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
                  <button className="py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 bg-white text-blue-600 shadow-sm">
                    <ShipIcon size={16} />
                    <span>Vessel</span>
                  </button>
                  <button className="py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <TruckIcon size={16} />
                    <span>Crane</span>
                  </button>
                  <button className="py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <TruckIcon size={16} />
                    <span>Transport</span>
                  </button>
                  <button className="py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <LinkIcon size={16} />
                    <span>Sling</span>
                  </button>
                  <button className="py-2 px-3 text-sm font-medium rounded-md flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <AnchorIcon size={16} />
                    <span>Shackle</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name / Model
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Barge XYZ-42" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Flat-top" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deck Space
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 85m × 24m" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Load
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 4500t" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compliance Standards
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      SOLAS
                      <button className="ml-1 text-blue-600 hover:text-blue-800">
                        <XIcon size={14} />
                      </button>
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      ISM
                      <button className="ml-1 text-blue-600 hover:text-blue-800">
                        <XIcon size={14} />
                      </button>
                    </span>
                    <input type="text" className="flex-grow px-2 py-1 border-0 bg-transparent focus:outline-none" placeholder="Add standard..." />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Equipment Image (Optional)
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
                    <ImageIcon size={36} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload an image of the equipment
                    </p>
                    <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer inline-flex items-center">
                      <UploadIcon size={16} className="mr-1" />
                      Browse Image
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png" />
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Supporting Documents
                    </label>
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <PlusIcon size={14} className="mr-1" />
                      Add Document
                    </button>
                  </div>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex">
                      <div className="w-2/5 text-sm font-medium text-gray-700">
                        Document Name
                      </div>
                      <div className="w-2/5 text-sm font-medium text-gray-700">
                        File
                      </div>
                      <div className="w-1/5 text-sm font-medium text-gray-700">
                        Expiry Date
                      </div>
                    </div>
                    <div className="p-4 flex items-center border-b border-gray-200">
                      <div className="w-2/5">
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Stability Calculations" />
                      </div>
                      <div className="w-2/5 px-2">
                        <label className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50">
                          <span className="text-gray-500 text-sm">
                            Select file...
                          </span>
                          <UploadIcon size={16} className="text-gray-400" />
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                      <div className="w-1/5 px-2">
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                    <div className="p-4 flex items-center">
                      <div className="w-2/5">
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Marine Certificate" />
                      </div>
                      <div className="w-2/5 px-2">
                        <label className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50">
                          <span className="text-gray-500 text-sm">
                            Select file...
                          </span>
                          <UploadIcon size={16} className="text-gray-400" />
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                      <div className="w-1/5 px-2">
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start mb-4">
                  <InfoIcon size={18} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Equipment Validation</p>
                    <p>
                      New equipment will be reviewed by a manager before it
                      becomes available to all users. You can use it in your own
                      WMS documents immediately.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAddNew(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setShowAddNew(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Equipment
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};