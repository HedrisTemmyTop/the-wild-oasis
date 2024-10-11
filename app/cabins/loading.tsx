import Spinner from "../_components/Spinner";

function Loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <div className="text-xl text-primary-200">Loading cabin data...</div>
    </div>
  );
}

export default Loading;
