import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { CabinInteface } from "@/app/interface/interface";
import { Suspense } from "react";
export async function generateMetadata({
  params,
}: {
  params: { cabinId: string };
}) {
  const { name } = await getCabin(params.cabinId);

  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins: CabinInteface[] = await getCabins();

  const cabinIds = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return cabinIds;
}

export default async function Page({
  params,
}: {
  params: { cabinId: string };
}) {
  const { cabinId } = params;
  const cabin = await getCabin(cabinId);

  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
