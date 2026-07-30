import { motion } from 'motion/react';
import { useDownloads } from '../context/DownloadsContext';
import MovieCard from '../components/MovieCard';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const cell = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function Downloads() {
  const { downloads } = useDownloads();

  return (
    <div className="pt-6">
      <h1 className="text-3xl md:text-4xl">Your Downloads</h1>
      <div className="reel-divider" aria-hidden="true" />
      {downloads.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted"
        >
          Nothing downloaded yet. Browse a genre and tap the download icon on any movie.
        </motion.p>
      ) : (
        <motion.div
          className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6"
          variants={grid}
          initial="hidden"
          animate="show"
        >
          {downloads
            .slice()
            .sort((a, b) => b.downloadedAt - a.downloadedAt)
            .map((m) => (
              <motion.div key={m.id} variants={cell} className="mx-auto w-full max-w-[170px]">
                <MovieCard movie={m} />
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
}