const contracts = [
  {
    id: 1,
    name: 'Food Supply Contract',
    supplier: 'Brakes',
    type: 'food',
    endDate: '2024-06-30',
    status: 'active',
    contractValue: 65000,
    durationMonths: 24,
    area: 'Head Office',
    reminder: '1-month',
    internalContact: 'Hannah Carter',
    referenceNumber: 'CON-FOOD-001',
    notes: 'Covers weekly deliveries of fresh and dry ingredients.',
    lastReviewed: '2023-10-04',
    documents: [
      {
        key: 'insurance',
        name: 'Insurance Certificate',
        expiryDate: '2024-07-15',
        lastUploaded: '2023-07-01'
      },
      {
        key: 'gdpr',
        name: 'GDPR Compliance Statement',
        expiryDate: '2024-12-31',
        lastUploaded: '2023-12-01'
      },
      {
        key: 'priceLists',
        name: 'Supplier Price List',
        expiryDate: '2024-04-01',
        lastUploaded: '2023-10-15'
      }
    ]
  },
  {
    id: 2,
    name: 'Weekly Food Delivery',
    supplier: 'Brakes',
    type: 'food',
    endDate: '2024-03-15',
    status: 'active',
    contractValue: 28000,
    durationMonths: 12,
    area: 'Manchester Region',
    reminder: '2-weeks',
    internalContact: 'David Nguyen',
    referenceNumber: 'CON-FOOD-002',
    notes: 'Focuses on chilled products for northern sites.',
    lastReviewed: '2023-09-18',
    documents: [
      {
        key: 'insurance',
        name: 'Fleet Insurance',
        expiryDate: '2024-02-20',
        lastUploaded: '2023-02-10'
      },
      {
        key: 'tradingStandards',
        name: 'Trading Standards Inspection',
        expiryDate: '2024-03-01',
        lastUploaded: '2023-03-14'
      }
    ]
  },
  {
    id: 3,
    name: 'Alcohol Beverage Supply',
    supplier: 'JW Lees',
    type: 'drinks',
    endDate: '2024-05-20',
    status: 'active',
    contractValue: 42000,
    durationMonths: 18,
    area: 'National',
    reminder: '1-month',
    internalContact: 'Melissa Shaw',
    referenceNumber: 'CON-DRINKS-001',
    notes: 'Premium beer and wine selection for all venues.',
    lastReviewed: '2023-11-02',
    documents: [
      {
        key: 'insurance',
        name: 'Product Liability Insurance',
        expiryDate: '2024-05-10',
        lastUploaded: '2023-05-01'
      },
      {
        key: 'appendices',
        name: 'Wine List Appendix',
        expiryDate: '2024-08-01',
        lastUploaded: '2023-08-15'
      }
    ]
  },
  {
    id: 4,
    name: 'Bar Drinks Supply',
    supplier: 'JW Lees',
    type: 'drinks',
    endDate: '2024-02-28',
    status: 'expiring',
    contractValue: 15000,
    durationMonths: 12,
    area: 'Liverpool Region',
    reminder: '2-weeks',
    internalContact: 'Oliver James',
    referenceNumber: 'CON-DRINKS-002',
    notes: 'Cocktail mixes and bar staples.',
    lastReviewed: '2023-10-15',
    documents: [
      {
        key: 'insurance',
        name: 'Insurance Certificate',
        expiryDate: '2024-01-10',
        lastUploaded: '2023-01-05'
      },
      {
        key: 'gdpr',
        name: 'GDPR Compliance',
        expiryDate: '2024-02-05',
        lastUploaded: '2023-02-01'
      }
    ]
  },
  {
    id: 5,
    name: 'Cleaning Services',
    supplier: 'Countrywide',
    type: 'cleaning-and-chemicals',
    endDate: '2024-04-10',
    status: 'active',
    contractValue: 18500,
    durationMonths: 24,
    area: 'All Sites',
    reminder: '1-month',
    internalContact: 'Sara Mitchell',
    referenceNumber: 'CON-CLEAN-001',
    notes: 'Includes chemicals, PPE, and on-site audits.',
    lastReviewed: '2023-09-01',
    documents: [
      {
        key: 'tradingStandards',
        name: 'Safety Audit',
        expiryDate: '2024-04-30',
        lastUploaded: '2023-04-20'
      },
      {
        key: 'accreditations',
        name: 'BRC Accreditation',
        expiryDate: '2024-09-15',
        lastUploaded: '2023-09-10'
      }
    ]
  },
  {
    id: 6,
    name: 'Chemical Supply Contract',
    supplier: 'Countrywide',
    type: 'cleaning-and-chemicals',
    endDate: '2023-12-01',
    status: 'expired',
    contractValue: 12000,
    durationMonths: 18,
    area: 'Head Office',
    reminder: '1-month',
    internalContact: 'Sara Mitchell',
    referenceNumber: 'CON-CLEAN-002',
    notes: 'Legacy agreement awaiting renewal decision.',
    lastReviewed: '2023-08-10',
    documents: [
      {
        key: 'insurance',
        name: 'Chemical Liability Insurance',
        expiryDate: '2023-11-20',
        lastUploaded: '2022-11-18'
      },
      {
        key: 'gdpr',
        name: 'GDPR Compliance',
        expiryDate: '2023-12-05',
        lastUploaded: '2023-01-05'
      }
    ]
  },
  {
    id: 7,
    name: 'Catering Equipment Purchase',
    supplier: 'Nisbets',
    type: 'catering-equipment',
    endDate: '2025-12-31',
    status: 'active',
    contractValue: 85000,
    durationMonths: 36,
    area: 'Capital Projects',
    reminder: '1-month',
    internalContact: 'Paul Hart',
    referenceNumber: 'CON-EQUIP-001',
    notes: 'Capital expenditure for new kitchen fit-outs.',
    lastReviewed: '2023-11-08',
    documents: [
      {
        key: 'insurance',
        name: 'Equipment Warranty Insurance',
        expiryDate: '2025-06-01',
        lastUploaded: '2023-06-10'
      },
      {
        key: 'appendices',
        name: 'Technical Specification Appendices',
        expiryDate: '2024-12-31',
        lastUploaded: '2023-12-15'
      }
    ]
  },
  {
    id: 8,
    name: 'Kitchen Equipment Lease',
    supplier: 'Nisbets',
    type: 'catering-equipment',
    endDate: '2024-08-15',
    status: 'active',
    contractValue: 35000,
    durationMonths: 24,
    area: 'South Region',
    reminder: '1-month',
    internalContact: 'Paul Hart',
    referenceNumber: 'CON-EQUIP-002',
    notes: 'Covers ovens, chillers, and maintenance.',
    lastReviewed: '2023-09-30',
    documents: [
      {
        key: 'insurance',
        name: 'Lease Insurance',
        expiryDate: '2024-07-01',
        lastUploaded: '2023-07-05'
      },
      {
        key: 'priceLists',
        name: 'Lease Fee Schedule',
        expiryDate: '2024-05-15',
        lastUploaded: '2023-10-01'
      }
    ]
  },
  {
    id: 9,
    name: 'Laundry Services',
    supplier: 'Elis',
    type: 'laundry',
    endDate: '2024-09-30',
    status: 'active',
    contractValue: 42500,
    durationMonths: 30,
    area: 'All Hotels',
    reminder: '1-month',
    internalContact: 'Kim Allen',
    referenceNumber: 'CON-LAUN-001',
    notes: 'Linen and uniform laundry with weekly pickups.',
    lastReviewed: '2023-11-15',
    documents: [
      {
        key: 'insurance',
        name: 'Laundry Insurance',
        expiryDate: '2024-09-01',
        lastUploaded: '2023-09-05'
      },
      {
        key: 'gdpr',
        name: 'Data Handling Statement',
        expiryDate: '2024-06-15',
        lastUploaded: '2023-06-10'
      }
    ]
  },
  {
    id: 10,
    name: 'Linens and Uniform Cleaning',
    supplier: 'Elis',
    type: 'laundry',
    endDate: '2024-01-25',
    status: 'expiring',
    contractValue: 22000,
    durationMonths: 12,
    area: 'North Region',
    reminder: '2-weeks',
    internalContact: 'Kim Allen',
    referenceNumber: 'CON-LAUN-002',
    notes: 'Seasonal uniforms & hospitality linens.',
    lastReviewed: '2023-10-22',
    documents: [
      {
        key: 'insurance',
        name: 'Seasonal Insurance',
        expiryDate: '2024-01-05',
        lastUploaded: '2023-01-10'
      },
      {
        key: 'tradingStandards',
        name: 'Quality Assurance Report',
        expiryDate: '2024-02-25',
        lastUploaded: '2023-03-01'
      }
    ]
  }
];

export default contracts;

