import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      {/* routes are lazy loaded, so adding suspense here to display placeholder till route chunk is loaded */}
      {/* we can support prefetching if bundles got bigger, just for simplicity I didn't add it here */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
}
