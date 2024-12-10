"use client";

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
  SECOND_FILTER_CATEGORY,
} from "@/constants/category";
import { FilterCategory } from "./FilterCategory";
import { useState } from "react";
import ActiveFilter from "./ActiveFilter";

interface categoryStateType {
  postType: "default" | "SELL" | "BUY";
  postStatus:
    | "default"
    | "POSTING"
    | "SALE_COMPLETED"
    | "PURCHASE_COMPLETED"
    | "HIDDEN";
  membershipType:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
  membershipDuration: "default" | "months_0_3" | "months_3_6" | "months_6_plus";
  PTCount: "default" | "PT_0_10" | "PT_10_25" | "PT_25_plus";
}

export default function Filter({
  onChangeFilter,
  filter,
}: {
  onChangeFilter: (obj: categoryStateType) => void;
  filter: categoryStateType;
}) {
  const obj: any = {};

  const [activeFilters, setActiveFilters] = useState({
    postType: "",
    postStatus: "",
    membershipType: "",
    membershipDuration: "",
    PTCount: "",
  });

  const handleInitFilters = (key: string, value: string) => {
    obj[key] = value;
    setActiveFilters({ ...activeFilters, ...obj });
  };

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, [e.target.name]: e.target.value });

    if (e.target.value !== "default") {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: e.target.options[e.target.selectedIndex].text,
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[700px]">
      <div className="flex gap-3">
        {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            value={filter[category.label]}
            onInit={handleInitFilters}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {SECOND_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            value={filter[category.label]}
            onInit={handleInitFilters}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 pl-4 mt-8 w-[100%] h-16 rounded-lg bg-blue-300">
        {Object.values(activeFilters).map((value, idx) => (
          <ActiveFilter key={idx} filterValue={value} />
        ))}
      </div>
    </div>
  );
}
