function Todayart() {

    const featuredArts = [
    {
      id: 1,
      title: "Golden Silence",
      artist: "Aarav Mehta",
      image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    },
    {
      id: 2,
      title: "Dream in Colors",
      artist: "Riya Sharma",
      image: "https://images.unsplash.com/photo-1500336624523-d727130c3328",
    },

  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>⭐ Featured Art</h1>
      <div style={styles.container}>
        {featuredArts.map((art) => (
          <div key={art.id} style={styles.card}>
            <img src={art.image} alt={art.title} style={styles.image} />

            <div style={styles.info}>
              <h2 style={styles.title}>{art.title}</h2>
              <p style={styles.artist}>by {art.artist}</p>
              <button style={styles.button}>View Artwork</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "5px",
    backgroundColor: "#111",
    // minHeight: "100%",
    height: "1000px",
    fontFamily: "Segoe UI, sans-serif",
    color: "#fff",
    fontsize:"1px",
    
},
heading: {
      fontSize: "10px",
    textAlign: "center",

    marginBottom: "15px",
  },
  subHeading: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "35px",
  },
  container: {
    display: "flex",
    gap: "25px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    width: "200px",
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
  },
  image: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
  },
  info: {
    padding: "5px",
    textAlign: "center",
  },
  title: {
    margin: "2px 0",
    fontSize: "14px",
  },
  artist: {
    color: "#666",
    marginBottom: "10px",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Todayart;