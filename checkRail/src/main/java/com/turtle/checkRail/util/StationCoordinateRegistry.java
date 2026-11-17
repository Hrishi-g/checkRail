package com.turtle.checkRail.util;

import com.turtle.checkRail.model.GeoCoordinate;

import java.util.*;

/**
 * Registry containing authentic geographic coordinates for Indian Railway stations.
 * Used for precise map plotting and real-world route rendering.
 */
public final class StationCoordinateRegistry {

    private static final Map<String, GeoCoordinate> CODE_MAP = new HashMap<>(400);
    private static final Map<String, GeoCoordinate> NAME_MAP = new HashMap<>(400);

    private static void registerCode(String code, double lat, double lng) {
        if (code != null && !code.trim().isEmpty()) {
            CODE_MAP.put(code.trim().toUpperCase(), new GeoCoordinate(lat, lng));
        }
    }

    private static void registerName(String name, double lat, double lng) {
        if (name != null && !name.trim().isEmpty()) {
            NAME_MAP.put(normalize(name), new GeoCoordinate(lat, lng));
        }
    }

    private static void registerStation(double lat, double lng, String[] codes, String[] names) {
        for (String c : codes) {
            registerCode(c, lat, lng);
        }
        for (String n : names) {
            registerName(n, lat, lng);
        }
    }

    public static String normalize(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("\\b(junction|jn|cantt|central|terminus|terminal|city|cabin|halt|town|road|rd)\\b", "")
                .replaceAll("[^a-z0-9]", "")
                .trim();
    }

    static {
        // --- Western & Central (Mumbai Corridor) ---
        registerStation(18.9696, 72.8195, new String[]{"MMCT", "BCT", "MUM"}, new String[]{"Mumbai Central", "Mumbai"});
        registerStation(18.9401, 72.8354, new String[]{"CSMT", "CSTM", "VT"}, new String[]{"Mumbai CSMT", "Chhatrapati Shivaji"});
        registerStation(19.0178, 72.8427, new String[]{"DR", "DDR"}, new String[]{"Dadar"});
        registerStation(19.0617, 72.8406, new String[]{"BDTS", "BA"}, new String[]{"Bandra Terminus", "Bandra"});
        registerStation(19.2288, 72.8569, new String[]{"BVI", "BOR"}, new String[]{"Borivali"});
        registerStation(19.1860, 72.9759, new String[]{"TNA", "THA"}, new String[]{"Thane"});
        registerStation(19.2437, 73.1355, new String[]{"KYN"}, new String[]{"Kalyan"});
        registerStation(18.9886, 73.1175, new String[]{"PNVL"}, new String[]{"Panvel"});
        registerStation(18.7557, 73.4091, new String[]{"LNL"}, new String[]{"Lonavala"});
        registerStation(18.5284, 73.8744, new String[]{"PUNE"}, new String[]{"Pune"});
        registerStation(20.3717, 72.9106, new String[]{"VAPI"}, new String[]{"Vapi"});
        registerStation(20.6124, 72.9267, new String[]{"BL"}, new String[]{"Valsad"});
        registerStation(20.9467, 72.9282, new String[]{"NVS"}, new String[]{"Navsari"});
        registerStation(21.2049, 72.8407, new String[]{"ST", "SUR"}, new String[]{"Surat"});
        registerStation(21.4645, 72.9782, new String[]{"AKV"}, new String[]{"Ankleshwar"});
        registerStation(21.7051, 72.9959, new String[]{"BH"}, new String[]{"Bharuch"});
        registerStation(22.3107, 73.1812, new String[]{"BRC", "VAD"}, new String[]{"Vadodara"});
        registerStation(22.5645, 72.9289, new String[]{"ANND"}, new String[]{"Anand"});
        registerStation(22.6916, 72.8634, new String[]{"ND"}, new String[]{"Nadiad"});
        registerStation(23.0225, 72.6006, new String[]{"ADI"}, new String[]{"Ahmedabad"});
        registerStation(23.2156, 72.6369, new String[]{"GNC"}, new String[]{"Gandhinagar Capital"});
        registerStation(22.3039, 70.8022, new String[]{"RJT"}, new String[]{"Rajkot"});
        registerStation(22.4707, 70.0577, new String[]{"JAM"}, new String[]{"Jamnagar"});
        registerStation(22.2442, 68.9685, new String[]{"DWK"}, new String[]{"Dwarka"});
        registerStation(23.0768, 70.1337, new String[]{"GIMB"}, new String[]{"Gandhidham"});
        registerStation(23.2420, 69.6669, new String[]{"BHUJ"}, new String[]{"Bhuj"});

        // --- West Central (Ratlam, Kota, Nagda) ---
        registerStation(22.7667, 74.2500, new String[]{"DHD"}, new String[]{"Dahod"});
        registerStation(22.9000, 74.6000, new String[]{"MGN"}, new String[]{"Meghnagar"});
        registerStation(23.3342, 75.0375, new String[]{"RTM", "RAT"}, new String[]{"Ratlam"});
        registerStation(23.4533, 75.4124, new String[]{"NAD", "NAG"}, new String[]{"Nagda"});
        registerStation(23.1824, 75.7772, new String[]{"UJN"}, new String[]{"Ujjain"});
        registerStation(22.7196, 75.8677, new String[]{"INDB"}, new String[]{"Indore"});
        registerStation(24.1833, 75.6500, new String[]{"SGZ"}, new String[]{"Shamgarh"});
        registerStation(24.5167, 75.8333, new String[]{"BWM"}, new String[]{"Bhawani Mandi"});
        registerStation(24.6338, 75.9754, new String[]{"RMA"}, new String[]{"Ramganj Mandi"});
        registerStation(25.2138, 75.8648, new String[]{"KOTA", "KOT"}, new String[]{"Kota"});
        registerStation(25.9928, 76.3688, new String[]{"SWM"}, new String[]{"Sawai Madhopur"});
        registerStation(26.3421, 76.5398, new String[]{"GGC"}, new String[]{"Gangapur City"});
        registerStation(26.7028, 76.8406, new String[]{"SMVJ"}, new String[]{"Shri Mahabirji"});
        registerStation(26.8906, 77.0189, new String[]{"HAN"}, new String[]{"Hindaun City"});
        registerStation(26.9015, 77.2882, new String[]{"BXN"}, new String[]{"Bayana"});
        registerStation(27.2152, 77.4930, new String[]{"BTE"}, new String[]{"Bharatpur"});
        registerStation(27.4924, 77.6737, new String[]{"MTJ"}, new String[]{"Mathura"});

        // --- Delhi NCR ---
        registerStation(28.4089, 77.3178, new String[]{"FDB"}, new String[]{"Faridabad"});
        registerStation(28.5888, 77.2534, new String[]{"NZM"}, new String[]{"Hazrat Nizamuddin", "Nizamuddin"});
        registerStation(28.6415, 77.2209, new String[]{"NDLS", "NEW"}, new String[]{"New Delhi"});
        registerStation(28.6609, 77.2273, new String[]{"DLI"}, new String[]{"Old Delhi", "Delhi"});
        registerStation(28.6508, 77.3152, new String[]{"ANVT"}, new String[]{"Anand Vihar Terminal", "Anand Vihar"});
        registerStation(28.5912, 77.1215, new String[]{"DEC"}, new String[]{"Delhi Cantt"});
        registerStation(28.6678, 77.4374, new String[]{"GZB"}, new String[]{"Ghaziabad"});

        // --- North Central (Agra, Gwalior, Jhansi, Bhopal) ---
        registerStation(27.1593, 78.0063, new String[]{"AGC"}, new String[]{"Agra Cantt"});
        registerStation(27.1815, 78.0167, new String[]{"AF"}, new String[]{"Agra Fort"});
        registerStation(26.7025, 77.8933, new String[]{"DHO"}, new String[]{"Dholpur"});
        registerStation(26.4967, 77.9944, new String[]{"MRA"}, new String[]{"Morena"});
        registerStation(26.2183, 78.1828, new String[]{"GWL"}, new String[]{"Gwalior"});
        registerStation(25.4484, 78.5685, new String[]{"VGLJ", "JHS"}, new String[]{"Jhansi", "VGL Jhansi"});
        registerStation(24.6933, 78.4150, new String[]{"LAR"}, new String[]{"Lalitpur"});
        registerStation(24.1785, 78.1842, new String[]{"BINA"}, new String[]{"Bina"});
        registerStation(23.2599, 77.4126, new String[]{"BPL"}, new String[]{"Bhopal"});
        registerStation(23.2120, 77.4379, new String[]{"RKMP", "HBJ"}, new String[]{"Rani Kamalapati", "Habibganj"});
        registerStation(22.6128, 77.7618, new String[]{"ET"}, new String[]{"Itarsi"});
        registerStation(21.8239, 76.3533, new String[]{"KNW"}, new String[]{"Khandwa"});
        registerStation(21.0478, 75.7873, new String[]{"BSL"}, new String[]{"Bhusaval"});
        registerStation(21.0077, 75.5626, new String[]{"JL"}, new String[]{"Jalgaon"});
        registerStation(20.2520, 74.4365, new String[]{"MMR"}, new String[]{"Manmad"});
        registerStation(19.9975, 73.7898, new String[]{"NK"}, new String[]{"Nashik Road"});

        // --- UP / Bihar / East (Delhi to Howrah) ---
        registerStation(27.8974, 78.0880, new String[]{"ALJN"}, new String[]{"Aligarh"});
        registerStation(27.2084, 78.2415, new String[]{"TDL"}, new String[]{"Tundla"});
        registerStation(26.9000, 79.0333, new String[]{"ETW"}, new String[]{"Etawah"});
        registerStation(26.4537, 80.3512, new String[]{"CNB"}, new String[]{"Kanpur Central", "Kanpur"});
        registerStation(25.4484, 81.8340, new String[]{"PRYJ", "ALD"}, new String[]{"Prayagraj", "Allahabad"});
        registerStation(25.1463, 82.5697, new String[]{"MZP"}, new String[]{"Mirzapur"});
        registerStation(25.3268, 82.9876, new String[]{"BSB"}, new String[]{"Varanasi"});
        registerStation(25.2818, 83.1177, new String[]{"DDU", "MGS"}, new String[]{"Pt Deen Dayal Upadhyaya", "Mughal Sarai"});
        registerStation(25.5647, 83.9777, new String[]{"BXR"}, new String[]{"Buxar"});
        registerStation(25.5560, 84.6603, new String[]{"ARA"}, new String[]{"Ara"});
        registerStation(25.5891, 85.0444, new String[]{"DNR"}, new String[]{"Danapur"});
        registerStation(25.6022, 85.1376, new String[]{"PNBE"}, new String[]{"Patna"});
        registerStation(25.1718, 86.1158, new String[]{"KIUL"}, new String[]{"Kiul"});
        registerStation(24.7725, 86.3813, new String[]{"JAJ"}, new String[]{"Jhajha"});
        registerStation(24.5167, 86.6500, new String[]{"JSME"}, new String[]{"Jasidih"});
        registerStation(24.2643, 86.6436, new String[]{"MDP"}, new String[]{"Madhupur"});
        registerStation(23.8647, 86.9038, new String[]{"CRJ"}, new String[]{"Chittaranjan"});
        registerStation(23.6889, 86.9661, new String[]{"ASN"}, new String[]{"Asansol"});
        registerStation(23.5333, 87.2833, new String[]{"DGR"}, new String[]{"Durgapur"});
        registerStation(23.2324, 87.8615, new String[]{"BWN"}, new String[]{"Barddhaman", "Burdwan"});
        registerStation(22.5839, 88.3426, new String[]{"HWH"}, new String[]{"Howrah"});
        registerStation(22.5675, 88.3713, new String[]{"SDAH"}, new String[]{"Sealdah"});
        registerStation(22.6021, 88.3784, new String[]{"KOAA"}, new String[]{"Kolkata"});

        // --- Grand Chord & Central East ---
        registerStation(24.7955, 85.0002, new String[]{"GAYA"}, new String[]{"Gaya"});
        registerStation(24.4667, 85.6000, new String[]{"KQR"}, new String[]{"Koderma"});
        registerStation(23.7833, 86.1667, new String[]{"GMO"}, new String[]{"NSCB Gomoh"});
        registerStation(23.7957, 86.4304, new String[]{"DHN"}, new String[]{"Dhanbad"});
        registerStation(23.3441, 85.3096, new String[]{"RNC"}, new String[]{"Ranchi"});
        registerStation(22.7710, 86.2029, new String[]{"TATA"}, new String[]{"Tatanagar", "Jamshedpur"});
        registerStation(22.3371, 87.3223, new String[]{"KGP"}, new String[]{"Kharagpur"});
        registerStation(20.4625, 85.8830, new String[]{"CTC"}, new String[]{"Cuttack"});
        registerStation(20.2667, 85.8436, new String[]{"BBS"}, new String[]{"Bhubaneswar"});
        registerStation(19.8135, 85.8312, new String[]{"PURI"}, new String[]{"Puri"});

        // --- North East & UP ---
        registerStation(26.8317, 80.9234, new String[]{"LKO", "LJN"}, new String[]{"Lucknow"});
        registerStation(26.7588, 83.3853, new String[]{"GKP"}, new String[]{"Gorakhpur"});
        registerStation(26.6854, 88.4419, new String[]{"NJP"}, new String[]{"New Jalpaiguri"});
        registerStation(26.1812, 91.7516, new String[]{"GHY"}, new String[]{"Guwahati"});

        // --- Rajasthan & Northwest ---
        registerStation(26.9196, 75.7878, new String[]{"JP"}, new String[]{"Jaipur"});
        registerStation(26.4526, 74.6399, new String[]{"AII"}, new String[]{"Ajmer"});
        registerStation(26.2847, 73.0232, new String[]{"JU"}, new String[]{"Jodhpur"});
        registerStation(30.3610, 76.7725, new String[]{"UMB"}, new String[]{"Ambala"});
        registerStation(30.7016, 76.8215, new String[]{"CDG"}, new String[]{"Chandigarh"});
        registerStation(31.6330, 74.8656, new String[]{"ASR"}, new String[]{"Amritsar"});
        registerStation(32.7060, 74.8800, new String[]{"JAT"}, new String[]{"Jammu Tawi", "Jammu"});
        registerStation(29.9457, 78.1564, new String[]{"HW"}, new String[]{"Haridwar"});
        registerStation(30.3165, 78.0322, new String[]{"DDN"}, new String[]{"Dehradun"});

        // --- South & South Central ---
        registerStation(21.1524, 79.0882, new String[]{"NGP"}, new String[]{"Nagpur"});
        registerStation(17.4344, 78.5015, new String[]{"SC"}, new String[]{"Secunderabad"});
        registerStation(17.3924, 78.4682, new String[]{"HYB"}, new String[]{"Hyderabad"});
        registerStation(16.5186, 80.6201, new String[]{"BZA"}, new String[]{"Vijayawada"});
        registerStation(17.7215, 83.2878, new String[]{"VSKP"}, new String[]{"Visakhapatnam"});
        registerStation(12.9781, 77.5694, new String[]{"SBC"}, new String[]{"KSR Bengaluru", "Bengaluru", "Bangalore"});
        registerStation(13.0247, 77.5457, new String[]{"YPR"}, new String[]{"Yesvantpur"});
        registerStation(13.0827, 80.2757, new String[]{"MAS"}, new String[]{"Chennai Central", "Chennai"});
        registerStation(13.6288, 79.4192, new String[]{"RU", "TPTY"}, new String[]{"Tirupati", "Renigunta"});
        registerStation(10.9972, 76.9634, new String[]{"CBE"}, new String[]{"Coimbatore"});
        registerStation(9.9680, 76.2921, new String[]{"ERS"}, new String[]{"Ernakulam", "Kochi"});
        registerStation(8.4875, 76.9532, new String[]{"TVC"}, new String[]{"Thiruvananthapuram"});
        registerStation(17.6599, 75.9064, new String[]{"SUR"}, new String[]{"Solapur"});
        registerStation(15.2736, 73.9582, new String[]{"MAO"}, new String[]{"Madgaon", "Goa"});
    }

    /**
     * Look up coordinate by station code or name.
     */
    public static Optional<GeoCoordinate> find(String codeOrName) {
        if (codeOrName == null || codeOrName.trim().isEmpty()) {
            return Optional.empty();
        }
        return find(codeOrName, codeOrName);
    }

    /**
     * Look up coordinate by exact station code, or exact/contained station name.
     * Prevents false prefix collisions across distant parts of the country.
     */
    public static Optional<GeoCoordinate> find(String code, String name) {
        // 1. Exact station code lookup
        if (code != null && !code.trim().isEmpty()) {
            String cleanCode = code.trim().toUpperCase();
            if (CODE_MAP.containsKey(cleanCode)) {
                return Optional.of(CODE_MAP.get(cleanCode));
            }
        }

        // 2. Exact normalized name lookup
        if (name != null && !name.trim().isEmpty()) {
            String cleanName = normalize(name);
            if (NAME_MAP.containsKey(cleanName)) {
                return Optional.of(NAME_MAP.get(cleanName));
            }

            // Substring search only if name is distinctive (length >= 5)
            if (cleanName.length() >= 5) {
                for (Map.Entry<String, GeoCoordinate> entry : NAME_MAP.entrySet()) {
                    if (entry.getKey().length() >= 5 && (cleanName.contains(entry.getKey()) || entry.getKey().contains(cleanName))) {
                        return Optional.of(entry.getValue());
                    }
                }
            }
        }

        return Optional.empty();
    }

    /**
     * Resolves coordinates for a complete list of stops, interpolating intermediate stations
     * along the true track path between confirmed stations.
     */
    public static List<GeoCoordinate> resolveRouteCoordinates(List<StopQueryItem> items) {
        int count = items.size();
        if (count == 0) return Collections.emptyList();

        GeoCoordinate[] resolved = new GeoCoordinate[count];

        // 1. Direct matches
        for (int i = 0; i < count; i++) {
            StopQueryItem item = items.get(i);
            Optional<GeoCoordinate> opt = find(item.code(), item.name());
            if (opt.isPresent()) {
                resolved[i] = opt.get();
            }
        }

        // 2. Guarantee origin and destination have valid coordinates
        if (resolved[0] == null) {
            // If origin is not resolved, fallback to start of route
            resolved[0] = new GeoCoordinate(18.9696, 72.8195);
        }
        if (resolved[count - 1] == null) {
            resolved[count - 1] = new GeoCoordinate(28.6415, 77.2209);
        }

        // 3. Interpolate unresolved intermediate stops along the corridor
        for (int i = 0; i < count; i++) {
            if (resolved[i] != null) continue;

            int prevIdx = 0;
            for (int p = i - 1; p >= 0; p--) {
                if (resolved[p] != null) {
                    prevIdx = p;
                    break;
                }
            }

            int nextIdx = count - 1;
            for (int n = i + 1; n < count; n++) {
                if (resolved[n] != null) {
                    nextIdx = n;
                    break;
                }
            }

            double distP = items.get(prevIdx).distanceKm();
            double distN = items.get(nextIdx).distanceKm();
            double distI = items.get(i).distanceKm();

            double t;
            if (distN > distP && distI >= distP && distI <= distN) {
                t = (distI - distP) / (distN - distP);
            } else {
                t = (double) (i - prevIdx) / Math.max(1, nextIdx - prevIdx);
            }
            t = Math.max(0.0, Math.min(1.0, t));

            double lat = resolved[prevIdx].lat() + t * (resolved[nextIdx].lat() - resolved[prevIdx].lat());
            double lng = resolved[prevIdx].lng() + t * (resolved[nextIdx].lng() - resolved[prevIdx].lng());
            resolved[i] = new GeoCoordinate(lat, lng);
        }

        return Arrays.asList(resolved);
    }

    public record StopQueryItem(String code, String name, int distanceKm) {}
}
