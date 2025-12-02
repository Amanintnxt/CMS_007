import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().split('T')[0];
};

const sanitizeRecord = (record = {}, rowIndex = 0) => {
  const cleanedName = record.name?.trim();
  const cleanedSupplier = record.supplier?.trim();

  if (!cleanedName || !cleanedSupplier) {
    throw new Error(`Row ${rowIndex}: "name" and "supplier" are required.`);
  }

  const reference = record.referenceNumber?.trim();

  return {
    id: record.id ? Number(record.id) : Date.now() + rowIndex,
    name: cleanedName,
    supplier: cleanedSupplier,
    type: record.type?.trim().toLowerCase() || 'other',
    endDate: normalizeDate(record.endDate),
    status: (record.status || 'active').toLowerCase(),
    contractValue: record.contractValue ? Number(record.contractValue) : null,
    durationMonths: record.durationMonths ? Number(record.durationMonths) : null,
    area: record.area?.trim() || null,
    reminder: record.reminder?.trim() || null,
    internalContact: record.internalContact?.trim() || null,
    referenceNumber:
      reference || `AUTO-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    notes: record.notes?.trim() || null,
    lastReviewed: normalizeDate(record.lastReviewed) || normalizeDate(new Date())
  };
};

const processPayload = (records) => {
  const sanitized = [];
  const errors = [];
  const seenReferences = new Set();

  records.forEach((record, idx) => {
    try {
      const cleaned = sanitizeRecord(record, idx + 2);
      if (seenReferences.has(cleaned.referenceNumber)) {
        throw new Error(
          `Row ${idx + 2}: duplicate reference number "${cleaned.referenceNumber}" inside upload.`
        );
      }
      seenReferences.add(cleaned.referenceNumber);
      sanitized.push(cleaned);
    } catch (error) {
      errors.push({ row: idx + 2, message: error.message });
    }
  });

  return {
    inserted: sanitized.length,
    failed: errors.length,
    errors,
    records: sanitized
  };
};

app.post('/api/contracts/bulk-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required under the "file" field.' });
  }

  try {
    const csvText = req.file.buffer.toString('utf-8');
    const parsed = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const result = processPayload(parsed);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to parse CSV upload.',
      details: error.message
    });
  }
});

app.post('/api/contracts/bulk-upload/json', (req, res) => {
  const { records = [] } = req.body || {};
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: 'Request body must include a non-empty "records" array.' });
  }

  try {
    const result = processPayload(records);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to process JSON payload.',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Bulk upload API listening on http://localhost:${PORT}`);
});

