const CountryCard = memo(({ country, isSaved }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer"
      style={{ backgroundColor: "var(--color-surface)" }}
      onClick={handleClick}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`${country.name.common} flag`}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          {country.name.common}
        </h3>
        <p
          className="text-sm mb-3"
          style={{ color: "var(--color-text-light)" }}
        >
          {country.region}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: "var(--color-text-light)" }}>
            Population: {new Intl.NumberFormat().format(country.population)}
          </div>
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: isSaved
                ? "var(--color-primary-light)"
                : "transparent",
            }}
          >
            <FiHeart
              fill={isSaved ? "var(--color-primary)" : "none"}
              stroke={
                isSaved ? "var(--color-primary)" : "var(--color-text-light)"
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});