import { getCabins } from "../_lib/data-service";
import { CabinInteface } from "../interface/interface";
import CabinCard from "./CabinCard";

export default async function CabinList({ filter }: { filter: string }) {
  //   noStore();
  const cabins: CabinInteface[] = await getCabins();
  console.log(cabins, "cabins");
  let displayedCabins: CabinInteface[] = [];
  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  return (
    displayedCabins.length > 0 && (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {displayedCabins.map((cabin: CabinInteface) => (
          <CabinCard cabin={cabin} key={cabin.id} />
        ))}
      </div>
    )
  );
}

// https://ozmavzxnpughpcrqwsfa.supabase.co/storage/v1/object/public/images/cabin-001.jpg
// https://ozmavzxnpughpcrqwsfa.supabase.co/storage/v1/object/public/image/cabin-002.jpg
