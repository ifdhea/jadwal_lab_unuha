import PublicController from './PublicController'
import DashboardController from './DashboardController'
import JadwalController from './JadwalController'
import TukarJadwalController from './TukarJadwalController'
import SesiJadwalController from './SesiJadwalController'
import BookingLaboratoriumController from './BookingLaboratoriumController'
import TahunAjaranController from './TahunAjaranController'
import SemesterController from './SemesterController'
import KampusController from './KampusController'
import LaboratoriumController from './LaboratoriumController'
import ProgramStudiController from './ProgramStudiController'
import KelasController from './KelasController'
import MataKuliahController from './MataKuliahController'
import KelasMataKuliahController from './KelasMataKuliahController'
import SlotWaktuController from './SlotWaktuController'
import DosenController from './DosenController'
import UserController from './UserController'
import JadwalMasterController from './JadwalMasterController'
import JadwalGeneratorController from './JadwalGeneratorController'
import Settings from './Settings'
const Controllers = {
    PublicController: Object.assign(PublicController, PublicController),
DashboardController: Object.assign(DashboardController, DashboardController),
JadwalController: Object.assign(JadwalController, JadwalController),
TukarJadwalController: Object.assign(TukarJadwalController, TukarJadwalController),
SesiJadwalController: Object.assign(SesiJadwalController, SesiJadwalController),
BookingLaboratoriumController: Object.assign(BookingLaboratoriumController, BookingLaboratoriumController),
TahunAjaranController: Object.assign(TahunAjaranController, TahunAjaranController),
SemesterController: Object.assign(SemesterController, SemesterController),
KampusController: Object.assign(KampusController, KampusController),
LaboratoriumController: Object.assign(LaboratoriumController, LaboratoriumController),
ProgramStudiController: Object.assign(ProgramStudiController, ProgramStudiController),
KelasController: Object.assign(KelasController, KelasController),
MataKuliahController: Object.assign(MataKuliahController, MataKuliahController),
KelasMataKuliahController: Object.assign(KelasMataKuliahController, KelasMataKuliahController),
SlotWaktuController: Object.assign(SlotWaktuController, SlotWaktuController),
DosenController: Object.assign(DosenController, DosenController),
UserController: Object.assign(UserController, UserController),
JadwalMasterController: Object.assign(JadwalMasterController, JadwalMasterController),
JadwalGeneratorController: Object.assign(JadwalGeneratorController, JadwalGeneratorController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers