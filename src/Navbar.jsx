import React from "react";

const Navbar = () => {
  return (
    <div style={styles.navbar}>
      {/* Left Logo */}
      <div style={styles.logo}>
        <div style={styles.logoBox}>Z</div>
        <span style={styles.logoText}>Zigguratss</span>
      </div>

      {/* Center Menu */}
      <ul style={styles.menu}>
        <li>Home</li>
        <li>Artwork's</li>
        <li>Artist</li>
        <li>Contact</li>
        <li>About</li>
      </ul>

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchInput}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    borderBottom: "2px solid black",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff"
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logoBox: {
    border: "2px solid #E8B13E",
    color: "#E8B13E",
    fontWeight: "bold",
    padding: "6px 10px",
    fontSize: "18px"
  },

  logoText: {
    color: "#E8B13E",
    fontSize: "22px",
    fontWeight: "600"
  },

  menu: {
    display: "flex",
    listStyle: "none",
    gap: "28px",
    fontSize: "16px",
    cursor: "pointer"
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    padding: "5px 10px",
    borderRadius: "20px"
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px"
  },

  searchIcon: {
    marginLeft: "6px",
    cursor: "pointer"
  }
};

export default Navbar;
