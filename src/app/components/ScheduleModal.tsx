import { useState } from "react";

export interface WorkSchedule {
  days: string;
  hours: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName?: string;
  schedule?: WorkSchedule;
  canEdit?: boolean;
  onSave?: (newSchedule: WorkSchedule) => void;
}

const DEFAULT_SCHEDULE: WorkSchedule = {
  days: "Lunes a Sábado",
  hours: "08:00 AM - 05:00 PM",
};

export function ScheduleModal({
  isOpen,
  onClose,
  professionalName = "Profesional",
  schedule = DEFAULT_SCHEDULE,
  canEdit = false,
  onSave,
}: ScheduleModalProps) {
  const [days, setDays] = useState(schedule.days);
  const [hours, setHours] = useState(schedule.hours);
  const [editing, setEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({
      days: days.trim() || DEFAULT_SCHEDULE.days,
      hours: hours.trim() || DEFAULT_SCHEDULE.hours,
    });
    setEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg space-y-4 text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-base">
            Horario de {professionalName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {!editing ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-amber-50 p-3 space-y-1">
              <p className="text-xs font-medium text-amber-800">Días de trabajo</p>
              <p className="font-medium text-gray-900">{schedule.days}</p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 space-y-1">
              <p className="text-xs font-medium text-amber-800">Horas de atención</p>
              <p className="font-medium text-gray-900">{schedule.hours}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setDays(schedule.days);
                    setHours(schedule.hours);
                    setEditing(true);
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                >
                  Llenar / Editar horario
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Días que trabaja
              </label>
              <input
                type="text"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Ej. Lunes a Viernes"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Horas que trabaja
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Ej. 08:00 AM - 04:00 PM"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white"
              >
                Guardar horario
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}