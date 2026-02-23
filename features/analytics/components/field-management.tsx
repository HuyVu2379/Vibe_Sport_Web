"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Plus, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface for dashboard field display (different from API Field type)
interface DashboardField {
  id: string;
  venueId: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  minPlayers?: number;
  maxPlayers?: number;
  isIndoor?: boolean;
  isActive: boolean;
  amenities?: string[];
  images?: string[];
}

interface FieldManagementProps {
  fields: DashboardField[];
  onEdit?: (field: DashboardField) => void;
  onDelete?: (field: DashboardField) => void;
  onToggleAvailability?: (field: DashboardField, available: boolean) => void;
  onAddField?: () => void;
}

export function FieldManagement({
  fields,
  onEdit,
  onDelete,
  onToggleAvailability,
  onAddField,
}: FieldManagementProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Field Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage your venue fields and availability
          </p>
        </div>
        <Button onClick={onAddField} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Field
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className={cn(
              "p-4 rounded-xl border transition-colors",
              field.isActive
                ? "border-border/50 bg-muted/20"
                : "border-border/30 bg-muted/10 opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{field.name}</h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      field.sportType === "football" && "bg-green-500/10 text-green-400",
                      field.sportType === "basketball" && "bg-orange-500/10 text-orange-400",
                      field.sportType === "tennis" && "bg-yellow-500/10 text-yellow-400",
                      field.sportType === "volleyball" && "bg-blue-500/10 text-blue-400"
                    )}
                  >
                    {field.sportType}
                  </Badge>
                  {field.isIndoor && (
                    <Badge variant="outline" className="text-xs">
                      Indoor
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>
                      {field.minPlayers}-{field.maxPlayers} players
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>${field.pricePerHour}/hr</span>
                  </div>
                </div>

                {field.amenities && field.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {field.amenities.slice(0, 4).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="text-xs bg-muted/50 text-muted-foreground"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {field.amenities.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-muted/50 text-muted-foreground"
                      >
                        +{field.amenities.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Available</span>
                  <Switch
                    checked={field.isActive}
                    onCheckedChange={(checked: boolean) => onToggleAvailability?.(field, checked)}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit?.(field)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(field)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
