import {
  Component,
  HostBinding,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Records } from './services/records';
import {
  Department,
  FormRecord
} from './models/form-record';
import {
  arabicOnlyValidator,
  englishOnlyValidator,
  futureDateValidator
} from './validators/form-record.validators';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';
type SearchField = 'all' | 'code' | 'name' | 'deadline';
type DepartmentFilter = 'all' | Department;

interface Translation {
  title: string;
  registryManagement: string;
  manageDescription: string;
  addRecord: string;
  editRecord: string;
  newRecord: string;
  code: string;
  arabicName: string;
  englishName: string;
  department: string;
  deadline: string;
  actions: string;
  selectDepartment: string;
  allDepartments: string;
  search: string;
  searchField: string;
  allFields: string;
  searchCode: string;
  searchName: string;
  searchDeadline: string;
  first: string;
  previous: string;
  next: string;
  last: string;
  jumpToPage: string;
  go: string;
  page: string;
  of: string;
  matchingRecords: string;
  noRecords: string;
  emptyDescription: string;
  loading: string;
  add: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirm: string;
  deleteRecord: string;
  deleteQuestion: string;
  codeValidation: string;
  uniqueCode: string;
  arabicValidation: string;
  englishValidation: string;
  departmentRequired: string;
  deadlineRequired: string;
  deadlinePast: string;
  duplicateRecord: string;
  failedLoad: string;
  failedCreate: string;
  failedUpdate: string;
  failedDelete: string;
  invalidPage: string;
  lightMode: string;
  darkMode: string;
  english: string;
  arabic: string;
  hr: string;
  finance: string;
  it: string;
  legal: string;
  editKicker: string;
  newKicker: string;
  searchPlaceholder: string;
}

const translations: Record<Language, Translation> = {
  en: {
    title: 'Registry Records',
    registryManagement: 'REGISTRY MANAGEMENT',
    manageDescription:
      'Manage, search and organize registry records.',
    addRecord: 'Add Record',
    editRecord: 'Edit Record',
    newRecord: 'New Record',
    code: 'Code',
    arabicName: 'Arabic Name',
    englishName: 'English Name',
    department: 'Department',
    deadline: 'Deadline',
    actions: 'Actions',
    selectDepartment: 'Select department',
    allDepartments: 'All departments',
    search: 'Search',
    searchField: 'Search field',
    allFields: 'All fields',
    searchCode: 'Code',
    searchName: 'Name',
    searchDeadline: 'Deadline',
    first: 'First',
    previous: 'Previous',
    next: 'Next',
    last: 'Last',
    jumpToPage: 'Jump to page',
    go: 'Go',
    page: 'Page',
    of: 'of',
    matchingRecords: 'matching records',
    noRecords: 'No records found.',
    emptyDescription:
      'Try changing your search or department filter.',
    loading: 'Loading...',
    add: 'Add',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    deleteRecord: 'Delete Record',
    deleteQuestion:
      'Are you sure you want to delete this record?',
    codeValidation:
      'Code is required and must be 1–4 digits.',
    uniqueCode: 'Code must be unique.',
    arabicValidation:
      'Arabic name must contain Arabic characters only.',
    englishValidation:
      'English name must contain English characters only.',
    departmentRequired: 'Department is required.',
    deadlineRequired: 'Deadline is required.',
    deadlinePast: 'Deadline cannot be in the past.',
    duplicateRecord: 'This record already exists.',
    failedLoad: 'Failed to load records.',
    failedCreate: 'Failed to create record.',
    failedUpdate: 'Failed to save changes.',
    failedDelete: 'Failed to delete',
    invalidPage: 'Enter a valid page number from',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    english: 'English',
    arabic: 'العربية',
    hr: 'HR',
    finance: 'Finance',
    it: 'IT',
    legal: 'Legal',
    editKicker: 'EDIT RECORD',
    newKicker: 'NEW RECORD',
    searchPlaceholder: 'Search records...'
  },

  ar: {
    title: 'سجلات النظام',
    registryManagement: 'إدارة السجلات',
    manageDescription:
      'إدارة السجلات والبحث عنها وتنظيمها بسهولة.',
    addRecord: 'إضافة سجل',
    editRecord: 'تعديل سجل',
    newRecord: 'سجل جديد',
    code: 'الرمز',
    arabicName: 'الاسم بالعربية',
    englishName: 'الاسم بالإنجليزية',
    department: 'القسم',
    deadline: 'الموعد النهائي',
    actions: 'الإجراءات',
    selectDepartment: 'اختر القسم',
    allDepartments: 'كل الأقسام',
    search: 'بحث',
    searchField: 'حقل البحث',
    allFields: 'كل الحقول',
    searchCode: 'الرمز',
    searchName: 'الاسم',
    searchDeadline: 'الموعد النهائي',
    first: 'الأول',
    previous: 'السابق',
    next: 'التالي',
    last: 'الأخير',
    jumpToPage: 'الانتقال إلى صفحة',
    go: 'انتقال',
    page: 'صفحة',
    of: 'من',
    matchingRecords: 'سجل مطابق',
    noRecords: 'لا توجد سجلات.',
    emptyDescription:
      'جرّب تغيير البحث أو فلتر القسم.',
    loading: 'جاري التحميل...',
    add: 'إضافة',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    deleteRecord: 'حذف سجل',
    deleteQuestion:
      'هل أنت متأكد من رغبتك في حذف هذا السجل؟',
    codeValidation:
      'الرمز مطلوب ويجب أن يتكون من 1 إلى 4 أرقام.',
    uniqueCode: 'يجب أن يكون الرمز فريدًا.',
    arabicValidation:
      'يجب أن يحتوي الاسم العربي على أحرف عربية فقط.',
    englishValidation:
      'يجب أن يحتوي الاسم الإنجليزي على أحرف إنجليزية فقط.',
    departmentRequired: 'القسم مطلوب.',
    deadlineRequired: 'الموعد النهائي مطلوب.',
    deadlinePast: 'لا يمكن أن يكون الموعد النهائي في الماضي.',
    duplicateRecord: 'هذا السجل موجود بالفعل.',
    failedLoad: 'فشل تحميل السجلات.',
    failedCreate: 'فشل إنشاء السجل.',
    failedUpdate: 'فشل حفظ التغييرات.',
    failedDelete: 'فشل حذف',
    invalidPage: 'أدخل رقم صفحة صحيح من',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    english: 'English',
    arabic: 'العربية',
    hr: 'الموارد البشرية',
    finance: 'المالية',
    it: 'تقنية المعلومات',
    legal: 'الشؤون القانونية',
    editKicker: 'تعديل السجل',
    newKicker: 'سجل جديد',
    searchPlaceholder: 'ابحث في السجلات...'
  }
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private recordsService = inject(Records);
  private fb = inject(FormBuilder);

  readonly pageSize = 10;

  records = signal<FormRecord[]>([]);
  loading = signal(true);

  currentPage = signal(1);

  departmentFilter =
    signal<DepartmentFilter>('all');

  searchField = signal<SearchField>('all');
  searchTerm = signal('');

  jumpPage = '';
  jumpPageError = '';

  theme = signal<Theme>('light');
  language = signal<Language>('en');

  editingId: string | null = null;
  errorMessage = '';

  deleteTarget: FormRecord | null = null;
  deleteErrorMessage = '';

  text = computed(
    () => translations[this.language()]
  );

  filteredRecords = computed(() => {
    const department = this.departmentFilter();
    const field = this.searchField();
    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    return this.records().filter(record => {
      const matchesDepartment =
        department === 'all' ||
        record.department === department;

      if (!matchesDepartment) {
        return false;
      }

      if (!search) {
        return true;
      }

      const code = record.code.toLowerCase();
      const arabicName =
        record.arabicName.toLowerCase();
      const englishName =
        record.englishName.toLowerCase();
      const deadline =
        record.submissionDeadline.toLowerCase();
      const recordDepartment =
        record.department.toLowerCase();

      switch (field) {
        case 'code':
          return code.includes(search);

        case 'name':
          return (
            arabicName.includes(search) ||
            englishName.includes(search)
          );

        case 'deadline':
          return deadline.includes(search);

        case 'all':
        default:
          return (
            code.includes(search) ||
            arabicName.includes(search) ||
            englishName.includes(search) ||
            recordDepartment.includes(search) ||
            deadline.includes(search)
          );
      }
    });
  });

  totalFilteredRecords = computed(
    () => this.filteredRecords().length
  );

  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.totalFilteredRecords() /
          this.pageSize
      )
    )
  );

  pageNumbers = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );

  paginatedRecords = computed(() => {
    const start =
      (this.currentPage() - 1) *
      this.pageSize;

    return this.filteredRecords().slice(
      start,
      start + this.pageSize
    );
  });

  form = this.fb.nonNullable.group({
    code: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{1,4}$/)
      ]
    ],

    arabicName: [
      '',
      [
        Validators.required,
        arabicOnlyValidator()
      ]
    ],

    englishName: [
      '',
      [
        Validators.required,
        englishOnlyValidator()
      ]
    ],

    department: [
      '',
      Validators.required
    ],

    submissionDeadline: [
      '',
      [
        Validators.required,
        futureDateValidator()
      ]
    ]
  });

  @HostBinding('class.dark-theme')
  get darkThemeClass(): boolean {
    return this.theme() === 'dark';
  }

  @HostBinding('class.rtl')
  get rtlClass(): boolean {
    return this.language() === 'ar';
  }

  constructor() {
    this.loadPreferences();
    this.loadRecords();
  }

  private loadPreferences(): void {
    const savedTheme =
      localStorage.getItem('registry-theme');

    const savedLanguage =
      localStorage.getItem('registry-language');

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark'
    ) {
      this.theme.set(savedTheme);
    }

    if (
      savedLanguage === 'en' ||
      savedLanguage === 'ar'
    ) {
      this.language.set(savedLanguage);
    }

    this.applyDocumentDirection();
  }

  private applyDocumentDirection(): void {
    document.documentElement.dir =
      this.language() === 'ar'
        ? 'rtl'
        : 'ltr';

    document.documentElement.lang =
      this.language();
  }

  toggleTheme(): void {
    const nextTheme: Theme =
      this.theme() === 'light'
        ? 'dark'
        : 'light';

    this.theme.set(nextTheme);

    localStorage.setItem(
      'registry-theme',
      nextTheme
    );
  }

  toggleLanguage(): void {
    const nextLanguage: Language =
      this.language() === 'en'
        ? 'ar'
        : 'en';

    this.language.set(nextLanguage);

    localStorage.setItem(
      'registry-language',
      nextLanguage
    );

    this.applyDocumentDirection();
  }

  private loadRecords(): void {
    this.loading.set(true);

    this.recordsService.getAll().subscribe({
      next: records => {
        this.records.set(records);
        this.ensureValidPage();
        this.loading.set(false);
      },

      error: () => {
        this.errorMessage =
          this.text().failedLoad;
        this.loading.set(false);
      }
    });
  }

  private ensureValidPage(): void {
    const lastPage = this.totalPages();

    if (this.currentPage() > lastPage) {
      this.currentPage.set(lastPage);
    }

    if (this.currentPage() < 1) {
      this.currentPage.set(1);
    }
  }

  setDepartmentFilter(value: string): void {
    this.departmentFilter.set(
      value as DepartmentFilter
    );

    this.currentPage.set(1);
    this.clearJumpPageError();
  }

  setSearchField(value: string): void {
    this.searchField.set(
      value as SearchField
    );

    this.currentPage.set(1);
    this.clearJumpPageError();
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);

    this.currentPage.set(1);
    this.clearJumpPageError();
  }

  startEdit(record: FormRecord): void {
    this.editingId = record.id;
    this.errorMessage = '';

    this.form.setValue({
      code: record.code,
      arabicName: record.arabicName,
      englishName: record.englishName,
      department: record.department,
      submissionDeadline:
        record.submissionDeadline.slice(0, 10)
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset();
  }

  openDeleteDialog(record: FormRecord): void {
    this.deleteTarget = record;
    this.deleteErrorMessage = '';
  }

  cancelDelete(): void {
    this.deleteTarget = null;
    this.deleteErrorMessage = '';
  }

  confirmDelete(): void {
    if (!this.deleteTarget) {
      return;
    }

    const recordToDelete =
      this.deleteTarget;

    this.deleteTarget = null;
    this.deleteErrorMessage = '';

    this.records.update(records =>
      records.filter(
        record =>
          record.id !== recordToDelete.id
      )
    );

    this.ensureValidPage();

    this.recordsService
      .delete(recordToDelete.id)
      .subscribe({
        next: () => {
          this.ensureValidPage();
        },

        error: () => {
          this.records.update(records => {
            const alreadyRestored =
              records.some(
                record =>
                  record.id ===
                  recordToDelete.id
              );

            if (alreadyRestored) {
              return records;
            }

            return [
              ...records,
              recordToDelete
            ];
          });

          this.ensureValidPage();

          this.deleteErrorMessage =
            `${this.text().failedDelete} ` +
            `${recordToDelete.arabicName}.`;
        }
      });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value =
      this.form.getRawValue();

    const currentRecords =
      this.records();

    const duplicateCode =
      currentRecords.some(
        record =>
          record.code === value.code &&
          record.id !== this.editingId
      );

    if (duplicateCode) {
      this.form.controls.code.setErrors({
        unique: true
      });

      return;
    }

    const duplicateRecord =
      currentRecords.some(
        record =>
          record.id !== this.editingId &&
          record.code === value.code &&
          record.arabicName ===
            value.arabicName &&
          record.englishName ===
            value.englishName &&
          record.department ===
            value.department &&
          record.submissionDeadline ===
            value.submissionDeadline
      );

    if (duplicateRecord) {
      this.form.setErrors({
        duplicate: true
      });

      return;
    }

    if (this.editingId !== null) {
      const existing =
        currentRecords.find(
          record =>
            record.id === this.editingId
        );

      if (!existing) {
        return;
      }

      const updated: FormRecord = {
        ...existing,
        code: value.code,
        arabicName: value.arabicName,
        englishName: value.englishName,
        department:
          value.department as Department,
        submissionDeadline:
          value.submissionDeadline
      };

      this.recordsService
        .update(this.editingId, updated)
        .subscribe({
          next: savedRecord => {
            this.records.update(records =>
              records.map(record =>
                record.id ===
                savedRecord.id
                  ? savedRecord
                  : record
              )
            );

            this.ensureValidPage();
            this.cancelEdit();
          },

          error: () => {
            this.errorMessage =
              this.text().failedUpdate;
          }
        });

      return;
    }

    const newRecord: FormRecord = {
      id: '',
      code: value.code,
      arabicName: value.arabicName,
      englishName: value.englishName,
      department:
        value.department as Department,
      submissionDeadline:
        value.submissionDeadline,
      createdAt:
        new Date().toISOString()
    };

    this.recordsService
      .create(newRecord)
      .subscribe({
        next: createdRecord => {
          this.records.update(records => [
            ...records,
            createdRecord
          ]);

          this.ensureValidPage();
          this.form.reset();
        },

        error: () => {
          this.errorMessage =
            this.text().failedCreate;
        }
      });
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages()
    ) {
      return;
    }

    this.currentPage.set(page);
    this.clearJumpPageError();
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    this.goToPage(
      this.currentPage() - 1
    );
  }

  goToNextPage(): void {
    this.goToPage(
      this.currentPage() + 1
    );
  }

  goToLastPage(): void {
    this.goToPage(
      this.totalPages()
    );
  }

  jumpToPage(): void {
    const page = Number(
      this.jumpPage
    );

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > this.totalPages()
    ) {
      this.jumpPageError =
        `${this.text().invalidPage} ` +
        `1 ${this.text().of} ` +
        `${this.totalPages()}.`;

      return;
    }

    this.currentPage.set(page);
    this.jumpPage = '';
    this.clearJumpPageError();
  }

  clearJumpPageError(): void {
    this.jumpPageError = '';
  }

  departmentLabel(
    department: Department
  ): string {
    switch (department) {
      case 'HR':
        return this.text().hr;

      case 'Finance':
        return this.text().finance;

      case 'IT':
        return this.text().it;

      case 'Legal':
        return this.text().legal;
    }
  }
}