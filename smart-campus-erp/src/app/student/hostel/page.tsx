// ============================================================
// Smart Campus ERP — Student Hostel & Residential Housing Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DashboardCard from "@/components/ui/DashboardCard";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { HostelIcon, CheckIcon } from "@/components/ui/Icons";
import type { Hostel } from "@/types";

export default function StudentHostelPage() {
  const { studentData } = useCurrentUser();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHostel() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.from("hostels").select("*").eq("id", "HST-001").maybeSingle();
        if (data) {
          setHostel(data);
        } else {
          setHostel({
            id: "HST-001",
            block: "Block Alpha (North Wing)",
            room_number: "Room 304-B",
            capacity: 2,
            occupied: 2,
            type: "Double Deluxe Sharing AC",
            warden_name: "Mr. Robert Vance",
            warden_phone: "+1 (555) 432-8765",
          });
        }
      } catch (err) {
        console.warn("[StudentHostel] Error loading hostel info:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHostel();
  }, []);

  if (loading) return <LoadingState message="Loading residential housing records…" />;

  if (studentData?.isDayScholar) {
    return (
      <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">Hostel & Residential Housing</h1>
            <p className="page-subtitle">Room allocation details and residential block info.</p>
          </div>
          <Badge variant="gray">Access Denied</Badge>
        </div>
        <div className="card-flat p-8 text-center border-rose-900/50 bg-rose-950/20">
          <HostelIcon className="w-12 h-12 mx-auto text-rose-500 mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-rose-400 mb-2">Hostel Access Restricted</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            You cannot access hostel services because you are registered as a Day Scholar. 
            If you need residential housing, please contact the administrative office.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Hostel & Residential Housing</h1>
          <p className="page-subtitle">
            Room allocation details, residential block, mess meal plans, and warden contacts.
          </p>
        </div>
        <Badge variant="green" dot>Room Allocated & Checked In</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Allocated Room"
          value={hostel?.room_number || "Room 304-B"}
          change={hostel?.block || "Block Alpha"}
          trend="neutral"
          icon={<HostelIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Room Type & Sharing"
          value={hostel?.type || "Double AC"}
          change="Capacity 2"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Residential Warden"
          value={hostel?.warden_name || "Mr. Robert Vance"}
          change="Available 24/7"
          trend="up"
          icon={<span className="text-base font-bold text-[#bf783e]">👨‍💼</span>}
        />
      </div>

      <div className="grid-2">
        <DashboardCard title="Residential Unit Specifications" subtitle="Allocated hostel room parameters">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Hostel Hall / Block</span>
              <span className="text-[#f4f6d6] font-medium">{hostel?.block || "Block Alpha (North Wing)"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Room Number</span>
              <span className="font-mono text-[#bf783e] font-bold">{hostel?.room_number || "Room 304-B"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Accommodation Plan</span>
              <span className="text-[#f4f6d6] font-medium">{hostel?.type || "Double Deluxe Sharing AC"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Roommate Status</span>
              <span className="text-emerald-400 font-medium">1 Roommate (Occupancy 2/2)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Hostel Entry Curfew</span>
              <span className="text-white/80">10:30 PM Weekdays / 11:30 PM Weekends</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Hostel Administration & Facilities" subtitle="Warden details and amenities included">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Chief Warden</span>
              <span className="text-[#f4f6d6] font-medium">{hostel?.warden_name || "Mr. Robert Vance"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Warden Emergency Helpline</span>
              <span className="text-[#bf783e] font-mono font-medium">{hostel?.warden_phone || "+1 (555) 432-8765"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Dining Mess Subscription</span>
              <Badge variant="green" dot>Standard 3-Meal Dining Plan</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">High-Speed Wi-Fi</span>
              <span className="text-emerald-400">Campus-Secure (Gigabit Fiber)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Laundry Service</span>
              <span className="text-white/80">Token Operated · 2nd Floor</span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
