import {
  User,
  InsertUser,
  Guide,
  InsertGuide,
  ContactMessage,
  InsertContactMessage,
  UscisData,
  InsertUscisData,
  Testimonial,
  InsertTestimonial,
  TranslationOrder,
  InsertTranslationOrder,
  TranslationPricing,
  InsertTranslationPricing,
} from "@shared/schema";
import { db } from "./db";
import {
  users,
  guides,
  contactMessages,
  uscisData,
  testimonials,
  translationOrders,
  translationPricing,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  hashPassword(password: string): Promise<string>;

  // Guide methods
  getAllGuides(): Promise<Guide[]>;
  getGuidesBySkillLevel(level: string): Promise<Guide[]>;
  getFeaturedGuides(): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  updateGuide(id: number, guide: Partial<InsertGuide>): Promise<Guide>;
  deleteGuide(id: number): Promise<void>;

  // Contact methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<void>;

  // USCIS data methods
  getUscisData(): Promise<UscisData[]>;
  updateUscisData(
    formType: string,
    fee: string,
    processingTime: string
  ): Promise<UscisData>;

  // Testimonial methods
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Translation order methods
  createTranslationOrder(
    order: InsertTranslationOrder
  ): Promise<TranslationOrder>;
  getTranslationOrder(
    orderNumber: string
  ): Promise<TranslationOrder | undefined>;
  getAllTranslationOrders(): Promise<TranslationOrder[]>;
  updateTranslationOrderStatus(
    orderNumber: string,
    status: string,
    adminNotes?: string,
    paymentIntentId?: string
  ): Promise<TranslationOrder>;
  updateTranslationOrderFiles(
    orderNumber: string,
    originalFilePath?: string,
    translatedFilePath?: string
  ): Promise<TranslationOrder>;
  deleteTranslationOrder(orderNumber: string): Promise<void>;

  // Translation pricing methods
  getAllTranslationPricing(): Promise<TranslationPricing[]>;
  getActiveTranslationPricing(): Promise<TranslationPricing[]>;
  getTranslationPricing(id: number): Promise<TranslationPricing | undefined>;
  createTranslationPricing(
    pricing: InsertTranslationPricing
  ): Promise<TranslationPricing>;
  updateTranslationPricing(
    id: number,
    pricing: Partial<InsertTranslationPricing>
  ): Promise<TranslationPricing>;
  deleteTranslationPricing(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private guides: Map<number, Guide>;
  private contactMessages: Map<number, ContactMessage>;
  private uscisData: Map<string, UscisData>;
  private testimonials: Map<number, Testimonial>;
  private translationOrders: Map<string, TranslationOrder>;
  private translationPricing: Map<number, TranslationPricing>;
  private currentUserId: number;
  private currentGuideId: number;
  private currentContactId: number;
  private currentTestimonialId: number;
  private currentTranslationOrderId: number;
  private currentTranslationPricingId: number;

  constructor() {
    this.users = new Map();
    this.guides = new Map();
    this.contactMessages = new Map();
    this.uscisData = new Map();
    this.testimonials = new Map();
    this.translationOrders = new Map();
    this.translationPricing = new Map();
    this.currentUserId = 1;
    this.currentGuideId = 1;
    this.currentContactId = 1;
    this.currentTestimonialId = 1;
    this.currentTranslationOrderId = 1;
    this.currentTranslationPricingId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Sample immigration guides
    const sampleGuides: Guide[] = [
      {
        id: 1,
        title: "Form I-130 Family Petition Guide",
        titleEs: "Guía de Petición Familiar I-130",
        description:
          "Complete step-by-step guide for filing Form I-130 to petition for family members. Includes forms, checklists, and examples.",
        descriptionEs:
          "Guía completa paso a paso para presentar el Formulario I-130 para peticionar familiares. Incluye formularios, listas de verificación y ejemplos.",
        fileUrl: "https://example.com/guide1.pdf",
        fileUrlEs: "https://example.com/guide1-es.pdf",
        formType: "I-130",
        price: "49.99",
        skillLevel: "beginner",
        featured: true,
        onlineFiling: false,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Form I-485 Adjustment of Status Guide",
        titleEs: "Guía de Ajuste de Estatus I-485",
        description:
          "Comprehensive guide for adjusting status to permanent resident while in the United States. Detailed instructions included.",
        descriptionEs:
          "Guía completa para ajustar el estatus a residente permanente mientras se encuentra en Estados Unidos. Instrucciones detalladas incluidas.",
        fileUrl: "https://example.com/guide1.pdf",
        fileUrlEs: "https://example.com/guide1-es.pdf",
        formType: "I-485",
        price: "59.99",
        skillLevel: "intermediate",
        featured: true,
        onlineFiling: false,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Form N-400 Naturalization Guide",
        titleEs: "Guía de Naturalización N-400",
        description:
          "Complete naturalization guide with interview preparation, study materials, and application assistance.",
        descriptionEs:
          "Guía completa de naturalización con preparación para entrevista, materiales de estudio y asistencia de aplicación.",
        fileUrl: "https://example.com/guide1.pdf",
        fileUrlEs: "https://example.com/guide1-es.pdf",
        formType: "N-400",
        price: "69.99",
        skillLevel: "advanced",
        featured: true,
        onlineFiling: true,
        createdAt: new Date(),
      },
    ];

    sampleGuides.forEach((guide) => {
      this.guides.set(guide.id, guide);
    });
    this.currentGuideId = sampleGuides.length + 1;

    // Sample USCIS data
    const sampleUscisData: UscisData[] = [
      {
        id: 1,
        formType: "I-130",
        fee: "$535",
        processingTime: "12-33 months",
        lastUpdated: new Date(),
      },
      {
        id: 2,
        formType: "I-485",
        fee: "$1,140",
        processingTime: "13-25 months",
        lastUpdated: new Date(),
      },
      {
        id: 3,
        formType: "N-400",
        fee: "$710",
        processingTime: "10-14 months",
        lastUpdated: new Date(),
      },
      {
        id: 4,
        formType: "I-765",
        fee: "$410",
        processingTime: "6-10 months",
        lastUpdated: new Date(),
      },
    ];

    sampleUscisData.forEach((data) => {
      this.uscisData.set(data.formType, data);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const hashedPassword = await this.hashPassword(insertUser.password);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      email: insertUser.email || null,
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find((user) => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error(`User ${id} not found`);
    }

    const updated: User = {
      ...existing,
      ...updateData,
      id,
    };

    // Hash password if it's being updated
    if (updateData.password) {
      updated.password = await this.hashPassword(updateData.password);
    }

    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async getAllGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }

  async getGuidesBySkillLevel(level: string): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(
      (guide) => guide.skillLevel === level
    );
  }

  async getFeaturedGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter((guide) => guide.featured);
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    return this.guides.get(id);
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const id = this.currentGuideId++;
    const guide: Guide = {
      ...insertGuide,
      id,
      createdAt: new Date(),
      featured: insertGuide.featured ?? false,
      onlineFiling: insertGuide.onlineFiling ?? false,
    };
    this.guides.set(id, guide);
    return guide;
  }

  async updateGuide(
    id: number,
    updateData: Partial<InsertGuide>
  ): Promise<Guide> {
    const existing = this.guides.get(id);
    if (!existing) {
      throw new Error(`Guide ${id} not found`);
    }

    const updated: Guide = {
      ...existing,
      ...updateData,
      id,
      createdAt: existing.createdAt,
    };

    this.guides.set(id, updated);
    return updated;
  }

  async deleteGuide(id: number): Promise<void> {
    this.guides.delete(id);
  }

  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      phone: insertMessage.phone || null,
      formType: insertMessage.formType || null,
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });
  }

  async deleteContactMessage(id: number): Promise<void> {
    this.contactMessages.delete(id);
  }

  async getUscisData(): Promise<UscisData[]> {
    return Array.from(this.uscisData.values());
  }

  async updateUscisData(
    formType: string,
    fee: string,
    processingTime: string
  ): Promise<UscisData> {
    const existing = this.uscisData.get(formType);
    const id = existing?.id || Date.now();

    const updated: UscisData = {
      id,
      formType,
      fee,
      processingTime,
      lastUpdated: new Date(),
    };

    this.uscisData.set(formType, updated);
    return updated;
  }

  async createTestimonial(
    insertTestimonial: InsertTestimonial
  ): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = {
      id,
      name: insertTestimonial.name,
      email: insertTestimonial.email,
      caseType: insertTestimonial.caseType,
      rating: insertTestimonial.rating,
      testimonial: insertTestimonial.testimonial,
      timeline: insertTestimonial.timeline || null,
      allowContact: insertTestimonial.allowContact || null,
      createdAt: new Date(),
    };

    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Translation order methods for MemStorage
  async createTranslationOrder(
    orderData: InsertTranslationOrder
  ): Promise<TranslationOrder> {
    const id = this.currentTranslationOrderId++;
    const order: TranslationOrder = {
      id,
      orderNumber: orderData.orderNumber,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      fileUrl: orderData.fileUrl,
      // originalFileName: orderData.originalFileName,
      // fileType: orderData.fileType,
      pageCount: orderData.pageCount,
      deliveryType: orderData.deliveryType,
      totalPrice: orderData.totalPrice,
      status: orderData.status || "pending",
      originalFilePath: orderData.originalFilePath || null,
      translatedFilePath: orderData.translatedFilePath || null,
      originalFileContent: orderData.originalFileContent || null,
      translatedFileContent: orderData.translatedFileContent || null,
      adminNotes: orderData.adminNotes || null,
      paymentIntentId: orderData.paymentIntentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.translationOrders.set(orderData.orderNumber, order);
    return order;
  }

  async getTranslationOrder(
    orderNumber: string
  ): Promise<TranslationOrder | undefined> {
    return this.translationOrders.get(orderNumber);
  }

  async getAllTranslationOrders(): Promise<TranslationOrder[]> {
    return Array.from(this.translationOrders.values()).sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return aTime - bTime;
    });
  }

  async updateTranslationOrderStatus(
    orderNumber: string,
    status: string,
    adminNotes?: string,
    paymentIntentId?: string
  ): Promise<TranslationOrder> {
    const order = this.translationOrders.get(orderNumber);
    if (!order) {
      throw new Error(`Translation order ${orderNumber} not found`);
    }

    const updatedOrder = {
      ...order,
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
      paymentIntentId:
        paymentIntentId !== undefined ? paymentIntentId : order.paymentIntentId,
      updatedAt: new Date(),
    };

    this.translationOrders.set(orderNumber, updatedOrder);
    return updatedOrder;
  }

  async updateTranslationOrderFiles(
    orderNumber: string,
    originalFilePath?: string,
    translatedFilePath?: string
  ): Promise<TranslationOrder> {
    const order = this.translationOrders.get(orderNumber);
    if (!order) {
      throw new Error(`Translation order ${orderNumber} not found`);
    }

    const updatedOrder = {
      ...order,
      originalFilePath:
        originalFilePath !== undefined
          ? originalFilePath
          : order.originalFilePath,
      translatedFilePath:
        translatedFilePath !== undefined
          ? translatedFilePath
          : order.translatedFilePath,
      updatedAt: new Date(),
    };

    this.translationOrders.set(orderNumber, updatedOrder);
    return updatedOrder;
  }

  async deleteTranslationOrder(orderNumber: string): Promise<void> {
    this.translationOrders.delete(orderNumber);
  }

  // Translation pricing methods for MemStorage
  async getAllTranslationPricing(): Promise<TranslationPricing[]> {
    return Array.from(this.translationPricing.values());
  }

  async getActiveTranslationPricing(): Promise<TranslationPricing[]> {
    return Array.from(this.translationPricing.values()).filter(
      (pricing) => pricing.active
    );
  }

  async getTranslationPricing(
    id: number
  ): Promise<TranslationPricing | undefined> {
    return this.translationPricing.get(id);
  }

  async createTranslationPricing(
    pricingData: InsertTranslationPricing
  ): Promise<TranslationPricing> {
    const id = this.currentTranslationPricingId++;
    const pricing: TranslationPricing = {
      id,
      serviceType: pricingData.serviceType,
      pricePerPage: pricingData.pricePerPage,
      minimumPrice: pricingData.minimumPrice,
      deliveryDays: pricingData.deliveryDays,
      description: pricingData.description,
      descriptionEs: pricingData.descriptionEs,
      active: pricingData.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.translationPricing.set(id, pricing);
    return pricing;
  }

  async updateTranslationPricing(
    id: number,
    updateData: Partial<InsertTranslationPricing>
  ): Promise<TranslationPricing> {
    const existing = this.translationPricing.get(id);
    if (!existing) {
      throw new Error(`Translation pricing ${id} not found`);
    }

    const updated: TranslationPricing = {
      ...existing,
      ...updateData,
      id,
      updatedAt: new Date(),
    };

    this.translationPricing.set(id, updated);
    return updated;
  }

  async deleteTranslationPricing(id: number): Promise<void> {
    this.translationPricing.delete(id);
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    console.log("✅ Using DatabaseStorage for all operations");
    // Sample data initialization removed - no longer auto-inserting sample data
  }

  private async initializeSampleData() {
    try {
      console.log("� Checking and inserting sample guide data...");

      // Sample immigration guides
      const sampleGuides = [
        {
          title: "Form I-130 Family Petition Guide",
          titleEs: "Guía de Petición Familiar I-130",
          description:
            "Complete step-by-step guide for filing Form I-130 to petition for family members. Includes forms, checklists, and examples.",
          descriptionEs:
            "Guía completa paso a paso para presentar el Formulario I-130 para peticionar familiares. Incluye formularios, listas de verificación y ejemplos.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-130",
          price: "49.99",
          skillLevel: "beginner",
          featured: true,
          onlineFiling: false,
        },
        {
          title: "Form I-485 Adjustment of Status Guide",
          titleEs: "Guía de Ajuste de Estatus I-485",
          description:
            "Comprehensive guide for adjusting status to permanent resident while in the United States. Detailed instructions included.",
          descriptionEs:
            "Guía completa para ajustar el estatus a residente permanente mientras se encuentra en Estados Unidos. Instrucciones detalladas incluidas.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-485",
          price: "59.99",
          skillLevel: "intermediate",
          featured: true,
          onlineFiling: false,
        },
        {
          title: "Form N-400 Naturalization Guide",
          titleEs: "Guía de Naturalización N-400",
          description:
            "Complete naturalization guide with interview preparation, study materials, and application assistance.",
          descriptionEs:
            "Guía completa de naturalización con preparación para entrevista, materiales de estudio y asistencia de aplicación.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "N-400",
          price: "69.99",
          skillLevel: "advanced",
          featured: true,
          onlineFiling: true,
        },
        {
          title: "Form I-765 Work Authorization Guide",
          titleEs: "Guía de Autorización de Trabajo I-765",
          description:
            "Step-by-step instructions for applying for employment authorization document (EAD). Includes eligibility categories and required documentation.",
          descriptionEs:
            "Instrucciones paso a paso para solicitar el documento de autorización de empleo (EAD). Incluye categorías de elegibilidad y documentación requerida.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-765",
          price: "39.99",
          skillLevel: "beginner",
          featured: false,
          onlineFiling: true,
        },
        {
          title: "Form I-131 Travel Document Guide",
          titleEs: "Guía de Documento de Viaje I-131",
          description:
            "Complete guide for applying for re-entry permits, refugee travel documents, and advance parole. Essential for international travel.",
          descriptionEs:
            "Guía completa para solicitar permisos de reingreso, documentos de viaje para refugiados y libertad condicional anticipada. Esencial para viajes internacionales.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-131",
          price: "44.99",
          skillLevel: "intermediate",
          featured: false,
          onlineFiling: true,
        },
        {
          title: "Form I-751 Remove Conditions Guide",
          titleEs: "Guía para Remover Condiciones I-751",
          description:
            "Detailed instructions for removing conditions on permanent residence based on marriage. Includes evidence requirements and timeline.",
          descriptionEs:
            "Instrucciones detalladas para remover las condiciones de la residencia permanente basada en matrimonio. Incluye requisitos de evidencia y cronograma.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-751",
          price: "54.99",
          skillLevel: "intermediate",
          featured: false,
          onlineFiling: true,
        },
        {
          title: "Form I-90 Green Card Renewal Guide",
          titleEs: "Guía de Renovación de Tarjeta Verde I-90",
          description:
            "Simple guide for renewing or replacing your permanent resident card. Covers all scenarios including lost, stolen, or expired cards.",
          descriptionEs:
            "Guía simple para renovar o reemplazar su tarjeta de residente permanente. Cubre todos los escenarios incluyendo tarjetas perdidas, robadas o vencidas.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-90",
          price: "34.99",
          skillLevel: "beginner",
          featured: false,
          onlineFiling: true,
        },
        {
          title: "Form I-864 Affidavit of Support Guide",
          titleEs: "Guía de Declaración Jurada de Apoyo I-864",
          description:
            "Comprehensive guide for sponsors filing affidavit of support. Includes income requirements, co-sponsor guidelines, and supporting documents.",
          descriptionEs:
            "Guía completa para patrocinadores que presentan declaración jurada de apoyo. Incluye requisitos de ingresos, pautas de co-patrocinador y documentos de apoyo.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-864",
          price: "47.99",
          skillLevel: "intermediate",
          featured: true,
          onlineFiling: false,
        },
        {
          title: "Form I-129F Fiancé Visa Guide",
          titleEs: "Guía de Visa de Prometido I-129F",
          description:
            "Complete K-1 fiancé visa petition guide with timeline, requirements, and interview preparation. Includes adjustment of status after marriage.",
          descriptionEs:
            "Guía completa de petición de visa K-1 de prometido con cronograma, requisitos y preparación para entrevista. Incluye ajuste de estatus después del matrimonio.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-129F",
          price: "64.99",
          skillLevel: "advanced",
          featured: true,
          onlineFiling: false,
        },
        {
          title: "Form I-601 Waiver Application Guide",
          titleEs: "Guía de Solicitud de Exención I-601",
          description:
            "Advanced guide for waiver of grounds of inadmissibility. Covers extreme hardship standards, evidence compilation, and legal strategies.",
          descriptionEs:
            "Guía avanzada para exención de causales de inadmisibilidad. Cubre estándares de dificultades extremas, compilación de evidencia y estrategias legales.",
          fileUrl: "https://example.com/guide1.pdf",
          fileUrlEs: "https://example.com/guide1-es.pdf",
          formType: "I-601",
          price: "89.99",
          skillLevel: "advanced",
          featured: false,
          onlineFiling: false,
        },
      ];

      // Insert sample guides (only if they don't already exist)
      for (const guide of sampleGuides) {
        const existingGuide = await db
          .select()
          .from(guides)
          .where(eq(guides.formType, guide.formType));
        if (existingGuide.length === 0) {
          await this.createGuide(guide);
          console.log(`✅ Added guide: ${guide.title}`);
        }
      }

      console.log("✅ Sample guide data inserted successfully");

      // Sample translation pricing data
      const samplePricing = [
        {
          serviceType: "standard",
          pricePerPage: "15.00",
          minimumPrice: "25.00",
          deliveryDays: 2,
          description:
            "Standard translation service with 48-hour delivery. Professional quality guaranteed.",
          descriptionEs:
            "Servicio de traducción estándar con entrega en 48 horas. Calidad profesional garantizada.",
          active: true,
        },
        {
          serviceType: "rush",
          pricePerPage: "25.00",
          minimumPrice: "40.00",
          deliveryDays: 1,
          description:
            "Rush translation service with 24-hour delivery. Priority processing for urgent documents.",
          descriptionEs:
            "Servicio de traducción urgente con entrega en 24 horas. Procesamiento prioritario para documentos urgentes.",
          active: true,
        },
        {
          serviceType: "certified",
          pricePerPage: "35.00",
          minimumPrice: "60.00",
          deliveryDays: 3,
          description:
            "Certified translation service with notarized certification. Accepted by USCIS and courts.",
          descriptionEs:
            "Servicio de traducción certificada con certificación notarizada. Aceptado por USCIS y tribunales.",
          active: true,
        },
      ];

      // Insert sample pricing (only if they don't already exist)
      for (const pricing of samplePricing) {
        const existingPricing = await db
          .select()
          .from(translationPricing)
          .where(eq(translationPricing.serviceType, pricing.serviceType));
        if (existingPricing.length === 0) {
          await this.createTranslationPricing(pricing);
          console.log(`Added pricing: ${pricing.serviceType}`);
        }
      }

      console.log("Sample translation pricing data inserted successfully");

      // Create default admin user if it doesn't exist
      const existingAdmin = await this.getUserByUsername("admin");
      if (!existingAdmin) {
        await this.createUser({
          username: "admin",
          password: "admin123", // This will be hashed
          email: "admin@example.com",
        });
        console.log(
          "Default admin user created (username: admin, password: admin123)"
        );
      }
    } catch (error) {
      console.error("Error inserting sample data:", error);
    }
  }

  // Translation order methods
  async createTranslationOrder(
    orderData: InsertTranslationOrder
  ): Promise<TranslationOrder> {
    const [order] = await db
      .insert(translationOrders)
      .values(orderData)
      .returning();
    return order;
  }

  async getTranslationOrder(
    orderNumber: string
  ): Promise<TranslationOrder | undefined> {
    const [order] = await db
      .select()
      .from(translationOrders)
      .where(eq(translationOrders.orderNumber, orderNumber));
    return order;
  }

  async getAllTranslationOrders(): Promise<TranslationOrder[]> {
    return await db
      .select()
      .from(translationOrders)
      .orderBy(translationOrders.createdAt);
  }

  async updateTranslationOrderStatus(
    orderNumber: string,
    status: string,
    adminNotes?: string,
    paymentIntentId?: string
  ): Promise<TranslationOrder> {
    const updateData: any = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (paymentIntentId !== undefined) {
      updateData.paymentIntentId = paymentIntentId;
    }

    const [order] = await db
      .update(translationOrders)
      .set(updateData)
      .where(eq(translationOrders.orderNumber, orderNumber))
      .returning();
    return order;
  }

  async updateTranslationOrderFiles(
    orderNumber: string,
    originalFilePath?: string,
    translatedFilePath?: string
  ): Promise<TranslationOrder> {
    const updateData: any = { updatedAt: new Date() };
    if (originalFilePath !== undefined) {
      updateData.originalFilePath = originalFilePath;
    }
    if (translatedFilePath !== undefined) {
      updateData.translatedFilePath = translatedFilePath;
    }

    const [order] = await db
      .update(translationOrders)
      .set(updateData)
      .where(eq(translationOrders.orderNumber, orderNumber))
      .returning();
    return order;
  }

  async deleteTranslationOrder(orderNumber: string): Promise<void> {
    await db
      .delete(translationOrders)
      .where(eq(translationOrders.orderNumber, orderNumber));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(insertUser.password);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const dataToUpdate = { ...updateData };

    // Hash password if it's being updated
    if (updateData.password) {
      dataToUpdate.password = await this.hashPassword(updateData.password);
    }

    const [user] = await db
      .update(users)
      .set(dataToUpdate)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Guide methods
  async getAllGuides(): Promise<Guide[]> {
    return await db.select().from(guides);
  }

  async getGuidesBySkillLevel(level: string): Promise<Guide[]> {
    return await db.select().from(guides).where(eq(guides.skillLevel, level));
  }

  async getFeaturedGuides(): Promise<Guide[]> {
    return await db.select().from(guides).where(eq(guides.featured, true));
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide;
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db.insert(guides).values(insertGuide).returning();
    return guide;
  }

  async updateGuide(
    id: number,
    updateData: Partial<InsertGuide>
  ): Promise<Guide> {
    const [guide] = await db
      .update(guides)
      .set(updateData)
      .where(eq(guides.id, id))
      .returning();
    return guide;
  }

  async deleteGuide(id: number): Promise<void> {
    await db.delete(guides).where(eq(guides.id, id));
  }

  // Contact methods
  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // USCIS data methods
  async getUscisData(): Promise<UscisData[]> {
    return await db.select().from(uscisData);
  }

  async updateUscisData(
    formType: string,
    fee: string,
    processingTime: string
  ): Promise<UscisData> {
    const [data] = await db
      .update(uscisData)
      .set({
        fee,
        processingTime,
        lastUpdated: new Date(),
      })
      .where(eq(uscisData.formType, formType))
      .returning();
    return data;
  }

  // Testimonial methods
  async createTestimonial(
    insertTestimonial: InsertTestimonial
  ): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  // Translation pricing methods
  async getAllTranslationPricing(): Promise<TranslationPricing[]> {
    return await db.select().from(translationPricing);
  }

  async getActiveTranslationPricing(): Promise<TranslationPricing[]> {
    return await db
      .select()
      .from(translationPricing)
      .where(eq(translationPricing.active, true));
  }

  async getTranslationPricing(
    id: number
  ): Promise<TranslationPricing | undefined> {
    const [pricing] = await db
      .select()
      .from(translationPricing)
      .where(eq(translationPricing.id, id));
    return pricing;
  }

  async createTranslationPricing(
    pricingData: InsertTranslationPricing
  ): Promise<TranslationPricing> {
    const [pricing] = await db
      .insert(translationPricing)
      .values(pricingData)
      .returning();
    return pricing;
  }

  async updateTranslationPricing(
    id: number,
    updateData: Partial<InsertTranslationPricing>
  ): Promise<TranslationPricing> {
    const [pricing] = await db
      .update(translationPricing)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(translationPricing.id, id))
      .returning();
    return pricing;
  }

  async deleteTranslationPricing(id: number): Promise<void> {
    await db.delete(translationPricing).where(eq(translationPricing.id, id));
  }
}

// Initialize storage system based on database availability
console.log("🔄 Initializing storage system...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL value:",
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ":***@")
    : "undefined"
);

// Use MemStorage for development when DATABASE_URL is not properly configured
const hasValidDatabase =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("placeholder") &&
  process.env.DATABASE_URL.startsWith("postgresql://");

let storage: IStorage;

if (hasValidDatabase) {
  storage = new DatabaseStorage();
  console.log("✅ Using DatabaseStorage for all operations");
} else {
  storage = new MemStorage();
  console.log(
    "✅ Using MemStorage for development (no valid DATABASE_URL found)"
  );
}

export { storage };
