import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Plus, Edit2, Trash2 } from "lucide-react";

const farmSchema = z.object({
  name: z.string().min(2, "Farm name required"),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  sizeHectares: z.coerce.number().optional(),
  sizeAcres: z.coerce.number().optional(),
  cropType: z.string().optional(),
  soilType: z.string().optional(),
  description: z.string().optional(),
});

type FarmFormData = z.infer<typeof farmSchema>;

interface Farm {
  id: number;
  name: string;
  location?: string;
  sizeHectares?: number;
  cropType?: string;
  isActive: boolean;
}

interface FarmManagerProps {
  farms?: Farm[];
  onAddFarm?: (farm: FarmFormData) => void;
  onEditFarm?: (id: number, farm: FarmFormData) => void;
  onDeleteFarm?: (id: number) => void;
}

export function FarmManager({ farms = [], onAddFarm, onEditFarm, onDeleteFarm }: FarmManagerProps) {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: "",
      location: "",
      sizeHectares: undefined,
      cropType: "",
      soilType: "",
      description: "",
    },
  });

  const translations = {
    en: {
      title: "Farm Management",
      addFarm: "Add New Farm",
      editFarm: "Edit Farm",
      farmName: "Farm Name",
      location: "Location",
      latitude: "Latitude",
      longitude: "Longitude",
      sizeHectares: "Size (Hectares)",
      sizeAcres: "Size (Acres)",
      cropType: "Crop Type",
      soilType: "Soil Type",
      description: "Description",
      save: "Save Farm",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      noFarms: "No farms yet. Create your first farm to get started.",
      active: "Active",
      inactive: "Inactive",
    },
    ar: {
      title: "إدارة المزارع",
      addFarm: "إضافة مزرعة جديدة",
      editFarm: "تحرير المزرعة",
      farmName: "اسم المزرعة",
      location: "الموقع",
      latitude: "خط العرض",
      longitude: "خط الطول",
      sizeHectares: "الحجم (هكتار)",
      sizeAcres: "الحجم (فدان)",
      cropType: "نوع المحصول",
      soilType: "نوع التربة",
      description: "الوصف",
      save: "حفظ المزرعة",
      cancel: "إلغاء",
      edit: "تحرير",
      delete: "حذف",
      noFarms: "لا توجد مزارع بعد. أنشئ مزرعتك الأولى للبدء.",
      active: "نشط",
      inactive: "غير نشط",
    },
  };

  const t = translations[language as keyof typeof translations];

  const onSubmit = async (data: FarmFormData) => {
    if (editingId) {
      onEditFarm?.(editingId, data);
      setEditingId(null);
    } else {
      onAddFarm?.(data);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (farm: Farm) => {
    setEditingId(farm.id);
    setShowForm(true);
    // TODO: Populate form with farm data
  };

  const handleDelete = (id: number) => {
    if (window.confirm(language === "en" ? "Delete this farm?" : "حذف هذه المزرعة؟")) {
      onDeleteFarm?.(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addFarm}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editingId ? t.editFarm : t.addFarm}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                reset();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.farmName}</label>
                <Input
                  {...register("name")}
                  placeholder="My Date Palm Farm"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.location}</label>
                <Input {...register("location")} placeholder="Riyadh, Saudi Arabia" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.sizeHectares}</label>
                <Input {...register("sizeHectares")} type="number" placeholder="50" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.cropType}</label>
                <Input {...register("cropType")} placeholder="Date Palms" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.latitude}</label>
                <Input {...register("latitude")} placeholder="24.7136" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.longitude}</label>
                <Input {...register("longitude")} placeholder="46.6753" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.soilType}</label>
                <Input {...register("soilType")} placeholder="Sandy Loam" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.description}</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Describe your farm..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
                {t.save}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t.cancel}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {farms.length === 0 && !showForm && (
        <Card className="p-8 bg-slate-50 text-center">
          <p className="text-slate-600 mb-4">{t.noFarms}</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addFarm}
          </Button>
        </Card>
      )}

      {farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <Card key={farm.id} className="p-4 bg-white hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{farm.name}</h3>
                  {farm.location && <p className="text-sm text-slate-600">{farm.location}</p>}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    farm.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {farm.isActive ? t.active : t.inactive}
                </span>
              </div>

              {(farm.sizeHectares || farm.cropType) && (
                <div className="text-sm text-slate-600 mb-3 space-y-1">
                  {farm.sizeHectares && <p>{farm.sizeHectares} ha</p>}
                  {farm.cropType && <p>{farm.cropType}</p>}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(farm)}
                  className="flex-1 border border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {t.edit}
                </Button>
                <Button
                  onClick={() => handleDelete(farm.id)}
                  className="flex-1 border border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t.delete}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
