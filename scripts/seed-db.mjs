import { writeFile } from 'node:fs/promises';

const departments = [
  {
    key: 'HR',
    arabicObjects: [
      'طلبات التوظيف',
      'ملفات الموظفين',
      'خطط الإجازات',
      'عقود الموظفين',
      'تقييمات الأداء'
    ],
    englishObjects: [
      'Recruitment Requests',
      'Employee Profiles',
      'Leave Plans',
      'Employee Contracts',
      'Performance Evaluations'
    ]
  },
  {
    key: 'Finance',
    arabicObjects: [
      'بيانات الموردين',
      'أوامر الشراء',
      'الفواتير المالية',
      'المصروفات التشغيلية',
      'تقارير الميزانية'
    ],
    englishObjects: [
      'Supplier Records',
      'Purchase Orders',
      'Financial Invoices',
      'Operating Expenses',
      'Budget Reports'
    ]
  },
  {
    key: 'IT',
    arabicObjects: [
      'أصول الشركة',
      'بيانات المخزون',
      'طلبات الصيانة',
      'صلاحيات المستخدمين',
      'حسابات الأنظمة'
    ],
    englishObjects: [
      'Company Assets',
      'Inventory Records',
      'Maintenance Requests',
      'User Permissions',
      'System Accounts'
    ]
  },
  {
    key: 'Legal',
    arabicObjects: [
      'العقود القانونية',
      'طلبات القضايا',
      'المراسلات الرسمية',
      'السياسات الداخلية',
      'اتفاقيات الشراكة'
    ],
    englishObjects: [
      'Legal Contracts',
      'Case Requests',
      'Official Correspondence',
      'Internal Policies',
      'Partnership Agreements'
    ]
  }
];

const actions = [
  { ar: 'تسجيل', en: 'Registration' },
  { ar: 'مراجعة', en: 'Review' },
  { ar: 'اعتماد', en: 'Approval' },
  { ar: 'تحديث', en: 'Update' },
  { ar: 'متابعة', en: 'Monitoring' }
];

const now = new Date();
const records = [];
let sequence = 1;

for (const department of departments) {
  for (let objectIndex = 0; objectIndex < department.arabicObjects.length; objectIndex += 1) {
    for (const action of actions) {
      const deadline = new Date(now);
      deadline.setUTCDate(deadline.getUTCDate() + 30 + sequence);
      deadline.setUTCHours(23, 59, 59, 0);

      const createdAt = new Date(now);
      createdAt.setUTCDate(createdAt.getUTCDate() - (45 - (sequence % 30)));
      createdAt.setUTCHours(8 + (sequence % 8), 0, 0, 0);

      records.push({
        id: `seed-${String(sequence).padStart(3, '0')}`,
        code: String(1000 + sequence),
        arabicName: `${action.ar} ${department.arabicObjects[objectIndex]}`,
        englishName: `${action.en} ${department.englishObjects[objectIndex]}`,
        department: department.key,
        submissionDeadline: deadline.toISOString(),
        createdAt: createdAt.toISOString()
      });

      sequence += 1;
    }
  }
}

if (records.length !== 100) {
  throw new Error(`Seed generation expected 100 records but produced ${records.length}.`);
}

const database = {
  forms: records,
  $schema: './node_modules/json-server/schema.json'
};

await writeFile(
  new URL('../db.json', import.meta.url),
  `${JSON.stringify(database, null, 2)}\n`,
  'utf8'
);

console.log(`Seeded db.json with ${records.length} records.`);
console.log('Codes: 1001–1100. Departments: 25 records each for HR, Finance, IT, and Legal.');
