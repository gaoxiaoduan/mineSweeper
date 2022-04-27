import React, { memo } from 'react';
import Footer from '../components/Footer';

const index = memo(() => {
  const WIGHT = 10;
  const HEIGHT = 10;
  let store = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIGHT }, (_, x) => y * 10 + x + 1),
  );

  return (
    <main className="h-[100vh] bg-white dark:bg-black font-sans p-8 text-center text-gray-700 dark:text-white">
      <h1 className="text-3xl font-bold">mine-sweeper</h1>

      <div>
        {store.map((row, y) => {
          return (
            <div key={y}>
              {row.map((item, x) => (
                <button className="w-9 h-9 border hover:bg-gray-50" key={x}>
                  {item}
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <Footer />
    </main>
  );
});

export default index;
