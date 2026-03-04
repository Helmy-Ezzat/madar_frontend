import FilterAccordion from "./FilterAccordion";
import { getOffices } from '@/services/officeService';
import { getLocations } from '@/services/locationService';
import { getSpecializations } from '@/services/specializationService';
import FilterDrawerSidbar from "./FilterDrawerSidbar";
import FilterCheckbox from "./FilterCheckbox";
import DateFilter from "./DateFilter";

export default async function Filters() {
    const [offices, locations, specializations] = await Promise.all([
        getOffices(),
        getLocations(),
        getSpecializations()
    ]);


    return (
        <FilterDrawerSidbar>
            <FilterAccordion title="تاريخ النشر" defaultOpen={true}>
                <DateFilter />
            </FilterAccordion>
            <FilterAccordion title="مكاتب إلحاق العمالة" defaultOpen={true}>
                {offices.map((office) => (
                    <FilterCheckbox
                        key={office.name}
                        label={office.name}
                        count={office.jobCount}
                        value={office.name}
                        paramName="company"
                    />
                ))}
            </FilterAccordion>

            <FilterAccordion title="الدول / المدن">
                {locations.map((location) => (
                    <FilterCheckbox
                        key={location.name}
                        label={location.name}
                        count={location.count}
                        value={location.name}
                        paramName="location"
                    />
                ))}
            </FilterAccordion>

            <FilterAccordion title="التخصصات">
                {specializations.map((spec) => (
                    <FilterCheckbox
                        key={spec.name}
                        label={spec.name}
                        count={spec.count}
                        value={spec.name}
                        paramName="specialization"
                    />
                ))}
            </FilterAccordion>
        </FilterDrawerSidbar>
    );
}