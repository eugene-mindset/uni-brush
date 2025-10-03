import astropy.units as unit
import astropy.coordinates as coord


alpha_cent = coord.SkyCoord(
    ra=coord.Angle("14h39m36.49400s"),
    dec=coord.Angle("−60°50′02.3737″"),
    distance=0.001302 * unit.kpc,
    frame="icrs",
).transform_to(coord.Galactocentric)
print(alpha_cent.x, alpha_cent.y, alpha_cent.z)

sol = coord.SkyCoord(
    ra=coord.Angle("0s"),
    dec=coord.Angle("0h0m0s"),
    distance=0 * unit.kpc,
    frame="icrs",
).transform_to(coord.Galactocentric)
print(sol.x, sol.y, sol.z)

# c = coord.SkyCoord.from_name("Alpha Centurai", frame="icrs")
# print(c)
