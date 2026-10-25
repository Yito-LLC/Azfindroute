// Generated from the district's published "School Bus Schedule" sheet
// (docs.google.com/spreadsheets/d/e/2PACX-1vT6MDzRv6f0HQmtBsdHVTEpGq7b9vuLOUV9OUBxU9MLFtFbJqlKmScieR6w14IKaduW5cqsa2SFkfhK),
// 2026-2027 schedule, for the six main high schools. Coordinates come from the
// Mapbox geocoder; `approximate: true` means only the street could be matched,
// and `unlocated: true` means the cross street could not be found at all.
// Times are the bus LEAVE time in the AM and the arrival time in the PM.

export const schools = [
    {
        "name": "Corona del Sol",
        "color": "#0f766e",
        "address": "1001 E Knox Rd, Tempe, AZ 85284",
        "lon": -111.925474,
        "lat": 33.325541
    },
    {
        "name": "Desert Vista",
        "color": "#b45309",
        "address": "16440 S 32nd St, Phoenix, AZ 85048",
        "lon": -112.01635,
        "lat": 33.295839
    },
    {
        "name": "Marcos de Niza",
        "color": "#7c3aed",
        "address": "6000 S Lakeshore Dr, Tempe, AZ 85283",
        "lon": -111.92044,
        "lat": 33.366502
    },
    {
        "name": "McClintock",
        "color": "#be123c",
        "address": "1830 E Del Rio Dr, Tempe, AZ 85282",
        "lon": -111.906593,
        "lat": 33.39821
    },
    {
        "name": "Mountain Pointe",
        "color": "#1d4ed8",
        "address": "4201 E Knox Rd, Phoenix, AZ 85044",
        "lon": -111.991769,
        "lat": 33.325129
    },
    {
        "name": "Tempe High",
        "color": "#15803d",
        "address": "1730 S Mill Ave, Tempe, AZ 85281",
        "lon": -111.940671,
        "lat": 33.408904
    }
];

export const busStops = [
    {
        "school": "Corona del Sol",
        "name": "E Caroline Ln & S Shannon Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:39",
                "pm": "2:59"
            }
        ],
        "lon": -111.897763,
        "lat": 33.329983
    },
    {
        "school": "Corona del Sol",
        "name": "N Congress Dr & N Seville Blvd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:42",
                "pm": "3:02"
            }
        ],
        "lon": -111.897763,
        "lat": 33.325207
    },
    {
        "school": "Corona del Sol",
        "name": "N Federal St & W Drake St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "6:30",
                "pm": "2:43"
            }
        ],
        "lon": -111.89645,
        "lat": 33.314774
    },
    {
        "school": "Corona del Sol",
        "name": "N Gila Springs Blvd & W Galveston St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "6:30",
                "pm": "Use RT #327"
            },
            {
                "route": "Route #327",
                "am": "Use RT # 311",
                "pm": "2:50"
            }
        ],
        "lon": -111.939614,
        "lat": 33.311461
    },
    {
        "school": "Corona del Sol",
        "name": "N Sicily Place & W Tyson St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "6:32",
                "pm": "Use Rt # 326"
            },
            {
                "route": "Route #326",
                "am": "Use Rt # 312",
                "pm": "2:45"
            }
        ],
        "lon": -111.901099,
        "lat": 33.308674
    },
    {
        "school": "Corona del Sol",
        "name": "N Windmills Blvd & W Park Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:45",
                "pm": "3:05"
            }
        ],
        "lon": -111.906377,
        "lat": 33.321869
    },
    {
        "school": "Corona del Sol",
        "name": "S Hearthstone Way & W Milky Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "6:38",
                "pm": "2:48"
            }
        ],
        "lon": -111.907658,
        "lat": 33.298214
    },
    {
        "school": "Corona del Sol",
        "name": "S Los Feliz Dr & E Calle de Caballos",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:35",
                "pm": "2:55"
            }
        ],
        "lon": -111.905637,
        "lat": 33.339591
    },
    {
        "school": "Corona del Sol",
        "name": "S Los Feliz Dr & E Louis Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:32",
                "pm": "2:52"
            }
        ],
        "lon": -111.906777,
        "lat": 33.347638
    },
    {
        "school": "Corona del Sol",
        "name": "S Tangerine Dr & W Butler Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "6:35",
                "pm": "Use RT #327"
            },
            {
                "route": "Route #327",
                "am": "Use RT # 311",
                "pm": "2:45"
            }
        ],
        "lon": -111.928145,
        "lat": 33.300189
    },
    {
        "school": "Corona del Sol",
        "name": "S. Ponderosa Ave & Fairview St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "6:20",
                "pm": "Use Rt # 326"
            },
            {
                "route": "Route #326",
                "am": "Use Rt # 312",
                "pm": "3:04"
            }
        ],
        "lon": -111.932792,
        "lat": 33.294719
    },
    {
        "school": "Corona del Sol",
        "name": "W Boston St & S Galaxy Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "6:43",
                "pm": "2:55"
            }
        ],
        "lon": -111.919879,
        "lat": 33.301803
    },
    {
        "school": "Corona del Sol",
        "name": "W Earhart Way & S Rita Ln",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "6:38",
                "pm": "2:48"
            }
        ],
        "lon": -111.925713,
        "lat": 33.295288
    },
    {
        "school": "Corona del Sol",
        "name": "W Galveston St & N Los Feliz Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "6:37",
                "pm": "2:50"
            }
        ],
        "lon": -111.905893,
        "lat": 33.311508
    },
    {
        "school": "Corona del Sol",
        "name": "W Harrison St & N Country Club Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "6:40",
                "pm": "2:52"
            }
        ],
        "lon": -111.903902,
        "lat": 33.314859
    },
    {
        "school": "Corona del Sol",
        "name": "W Krista Way & S Mill Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "6:23",
                "pm": "2:45"
            }
        ],
        "lon": -111.937141,
        "lat": 33.347647
    },
    {
        "school": "Corona del Sol",
        "name": "W Morelos St & S Los Feliz Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "6:35",
                "pm": "2:50"
            }
        ],
        "lon": -111.908239,
        "lat": 33.29467
    },
    {
        "school": "Corona del Sol",
        "name": "W. Geronimo St & Tangerine Dr",
        "detail": "At park, bus door will be park side",
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "6:22",
                "pm": "Use Rt # 326"
            },
            {
                "route": "Route #326",
                "am": "Use Rt # 312",
                "pm": "2:58"
            }
        ],
        "lon": -111.927807,
        "lat": 33.293111
    },
    {
        "school": "Desert Vista",
        "name": "35th Ave & Promontory Roundabout",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "7:56",
                "pm": "4:08"
            }
        ],
        "lon": -112.135288,
        "lat": 33.296487,
        "source": "district map",
        "approximate": true
    },
    {
        "school": "Desert Vista",
        "name": "E Ashurst Dr & S 3rd Place",
        "detail": "by the mailboxes on westside of Ashurst",
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "8:08",
                "pm": "3:55"
            }
        ],
        "lon": -112.06899,
        "lat": 33.295761,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Chandler Blvd. & S 1st Pl.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "7:55",
                "pm": "3:58"
            }
        ],
        "lon": -112.074391,
        "lat": 33.30395,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Chandler Blvd. & S 7th St.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "7:53",
                "pm": "3:56"
            }
        ],
        "lon": -112.064871,
        "lat": 33.309558,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Desert Broom Way & S 12th Place",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "8:01",
                "pm": "4:07"
            }
        ],
        "lon": -112.057894,
        "lat": 33.315712,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Liberty Ln & S.18th Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "7:55",
                "pm": "3:55"
            }
        ],
        "lon": -112.043989,
        "lat": 33.29213,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Marketplace SE & S 13th Place",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "8:02",
                "pm": "4:02"
            }
        ],
        "lon": -112.052633,
        "lat": 33.3041,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Ray Rd & 32nd St",
        "detail": "northside of Ray Rd",
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:53",
                "pm": "4:10"
            }
        ],
        "lon": -112.014589,
        "lat": 33.314966,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Rock Wren & E Rockledge",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:58",
                "pm": "4:00"
            }
        ],
        "lon": -112.029083,
        "lat": 33.313835,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E Thunderhill Pl & Sapium Way/Desert Trumpet",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "8:01",
                "pm": "3:58"
            }
        ],
        "lon": -112.035531,
        "lat": 33.307558,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E. Ray Rd & E. Desert Willow Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:55",
                "pm": "4:03"
            }
        ],
        "lon": -112.023993,
        "lat": 33.312659,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "E. Rock Wren Rd & E. Desert Trumpet Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:49",
                "pm": "4:05"
            }
        ],
        "lon": -112.01084,
        "lat": 33.313221,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "N. 16th St & W. Riggs Rd",
        "detail": "near Rehab center",
        "program": null,
        "runs": [
            {
                "route": "Route #330",
                "am": "7:05",
                "pm": "Use Rt # 337"
            },
            {
                "route": "Route #337",
                "am": "Use Rt #330",
                "pm": "4:30"
            }
        ],
        "lon": -112.047447,
        "lat": 33.221811,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 10th St. & E Hiddenview Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "Use Rt # 327",
                "pm": "4:25"
            },
            {
                "route": "Route #331",
                "am": "8:03",
                "pm": "Use Rt#314"
            }
        ],
        "lon": -112.061053,
        "lat": 33.302101,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 12th St. & E Glenhaven Dr.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "7:57",
                "pm": "3:57"
            }
        ],
        "lon": -112.057321,
        "lat": 33.2961,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 12th St. & E Marketplace SE",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "7:59",
                "pm": "3:59"
            }
        ],
        "lon": -112.055334,
        "lat": 33.301942,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 14th Place & E Thistle Landing Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:57",
                "pm": "4:02"
            }
        ],
        "lon": -112.053194,
        "lat": 33.311138,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 17th Ave. & W Nighthawk Way",
        "detail": "westside of 17th",
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "8:00",
                "pm": "4:05"
            }
        ],
        "lon": -112.097112,
        "lat": 33.297366,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 18th Pl. & E South Fork Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "8:04",
                "pm": "3:55"
            }
        ],
        "lon": -112.042958,
        "lat": 33.305647,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 42nd St & E Tanglewood Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "7:55",
                "pm": "3:55"
            }
        ],
        "lon": -111.991801,
        "lat": 33.298802,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 43rd Street & E Redwood Lane",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "8:05",
                "pm": "3:50"
            }
        ],
        "lon": -111.990947,
        "lat": 33.293995,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 48th Street & E Frye Road",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "8:00",
                "pm": "3:55"
            }
        ],
        "lon": -111.980235,
        "lat": 33.298063,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 50th St & Andante Apts SE corner",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:54",
                "pm": "4:00"
            }
        ],
        "lon": -111.975942,
        "lat": 33.301748,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 55th Ave & W Western Star Blvd",
        "detail": null,
        "program": "OPEN ENROLLMENT South MTN/Laveen area",
        "runs": [
            {
                "route": "Route #326",
                "am": "7:55",
                "pm": "4:05"
            },
            {
                "route": "Route #327 & #328",
                "am": "7:55",
                "pm": "4:05"
            }
        ],
        "lon": -112.177732,
        "lat": 33.351202
    },
    {
        "school": "Desert Vista",
        "name": "S 5th Ave & W Cathedral Rock Dr",
        "detail": "westside of 5th Ave",
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "8:08",
                "pm": "4:15"
            }
        ],
        "lon": -112.081712,
        "lat": 33.305948,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 5th Ave. & W Cathedral Rock",
        "detail": "eastside of 5th Ave",
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "Use RT#331",
                "pm": "4:15"
            },
            {
                "route": "Route #331",
                "am": "7:50",
                "pm": "Use Rt#306"
            }
        ],
        "lon": -112.081461,
        "lat": 33.306004,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 7th Dr. & W Chandler Blvd.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "8:03",
                "pm": "4:10"
            }
        ],
        "lon": -112.085281,
        "lat": 33.303117,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 8th St. & E Desert Trumpet Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "Use RT#331",
                "pm": "4:23"
            },
            {
                "route": "Route #331",
                "am": "7:55",
                "pm": "Use Rt#306"
            }
        ],
        "lon": -112.063013,
        "lat": 33.312557,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S 8th St. & E Mountain Sage Dr.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "Use RT#331",
                "pm": "4:20"
            },
            {
                "route": "Route #331",
                "am": "7:54",
                "pm": "Use Rt#306"
            }
        ],
        "lon": -112.064101,
        "lat": 33.317301,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Central Ave & S 1st Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:55",
                "pm": "4:03"
            }
        ],
        "lon": -112.080387,
        "lat": 33.299951,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Central Ave & W Briarwood Terrace",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:57",
                "pm": "4:05"
            }
        ],
        "lon": -112.081519,
        "lat": 33.295597,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Desert Foothills Pkwy & between S 1st St & S 4th St.",
        "detail": "Northside of Desert Foothills Pkwy",
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "8:04",
                "pm": "4:11"
            }
        ],
        "lon": -112.071553,
        "lat": 33.314381,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Desert Foothills Pkwy & E Desert Broom Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:59",
                "pm": "4:05"
            }
        ],
        "lon": -112.056792,
        "lat": 33.315885,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Desert Foothills Pkwy & S 4th Dr",
        "detail": "northside",
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "8:06",
                "pm": "4:13"
            }
        ],
        "lon": -112.079954,
        "lat": 33.31105,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S Desert Foothills Pkwy & S 4th Drive",
        "detail": "southside",
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "Use RT#331",
                "pm": "4:18"
            },
            {
                "route": "Route #331",
                "am": "7:52",
                "pm": "Use Rt#306"
            }
        ],
        "lon": -112.079755,
        "lat": 33.310861,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S. 18th Dr & W. Brookwood Ct",
        "detail": "South of Chandler on 18th Dr",
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "8:04",
                "pm": "4:12"
            }
        ],
        "lon": -112.098919,
        "lat": 33.302524,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "S. Marketplace NE & E. Mtn. Sky",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:55",
                "pm": "4:00"
            }
        ],
        "lon": -112.051703,
        "lat": 33.306412,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "Shaughnessey & 29th Ave",
        "detail": "SE Corner",
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "8:00",
                "pm": "4:03"
            }
        ],
        "lon": -112.122166,
        "lat": 33.296879,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "W Meadows Loop W & W Sophie Ln",
        "detail": null,
        "program": "OPEN ENROLLMENT South MTN/Laveen area",
        "runs": [
            {
                "route": "Route #326",
                "am": "7:40",
                "pm": "4:15"
            }
        ],
        "lon": -112.202267,
        "lat": 33.376318,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "W Saltsage Dr & S 12th Ave.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "8:00",
                "pm": "4:08"
            }
        ],
        "lon": -112.087938,
        "lat": 33.294644,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "W. Muirwood Dr & S. 14th Ave",
        "detail": "SW corner of intersection",
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "8:02",
                "pm": "4:09"
            }
        ],
        "lon": -112.091117,
        "lat": 33.30128,
        "source": "district map"
    },
    {
        "school": "Desert Vista",
        "name": "W. South Fork Dr & S. 16th Dr",
        "detail": "E of 16th Dr on South Fork by mailboxes",
        "program": null,
        "runs": [
            {
                "route": "Route #308",
                "am": "7:48",
                "pm": "3:55"
            }
        ],
        "lon": -112.094061,
        "lat": 33.302956,
        "source": "district map"
    },
    {
        "school": "Marcos de Niza",
        "name": "Avenida del Yaqui & Calle Senu",
        "detail": "dirt lot south of tribal office",
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "7:00",
                "pm": "3:15"
            }
        ],
        "lon": -111.961626,
        "lat": 33.360053
    },
    {
        "school": "Marcos de Niza",
        "name": "Calle Monctezuma & E Calle Sonora",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #323",
                "am": "7:00",
                "pm": "3:25"
            }
        ],
        "lon": -111.964047,
        "lat": 33.37091
    },
    {
        "school": "Marcos de Niza",
        "name": "E Calle Iglesia & S Calle Batoua",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #323",
                "am": "6:57",
                "pm": "3:23"
            }
        ],
        "lon": -111.961468,
        "lat": 33.367228
    },
    {
        "school": "Marcos de Niza",
        "name": "S Hardy Dr & W Grove Parkway",
        "detail": "SE corner on Hardy",
        "program": null,
        "runs": [
            {
                "route": "Route #317",
                "am": "7:00",
                "pm": "3:20"
            }
        ],
        "lon": -111.954502,
        "lat": 33.3548
    },
    {
        "school": "Marcos de Niza",
        "name": "S Jesse Owens Pkwy & S 7th St",
        "detail": "open field NW corner",
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "6:45",
                "pm": "Use RT #925A"
            },
            {
                "route": "Route #925A",
                "am": "Use RT #301",
                "pm": "3:35"
            }
        ],
        "lon": -112.065994,
        "lat": 33.374157
    },
    {
        "school": "Marcos de Niza",
        "name": "S McKemy St & S Hardy Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #325",
                "am": "6:53",
                "pm": "3:27"
            }
        ],
        "lon": -111.952902,
        "lat": 33.375633
    },
    {
        "school": "Marcos de Niza",
        "name": "S McKemy St & W Cornell Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #304",
                "am": "6:56",
                "pm": "3:20"
            }
        ],
        "lon": -111.951059,
        "lat": 33.372543
    },
    {
        "school": "Marcos de Niza",
        "name": "S McKemy St & W Libra Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #304",
                "am": "6:58",
                "pm": "3:18"
            }
        ],
        "lon": -111.950751,
        "lat": 33.365821
    },
    {
        "school": "Marcos de Niza",
        "name": "S McKemy St & W Vaughn St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #304",
                "am": "7:00",
                "pm": "3:15"
            }
        ],
        "lon": -111.951787,
        "lat": 33.36164
    },
    {
        "school": "McClintock",
        "name": "E 10th St. & S River Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #316",
                "am": "6:33",
                "pm": "2:40"
            }
        ],
        "lon": -111.896194,
        "lat": 33.419256
    },
    {
        "school": "McClintock",
        "name": "E 8th St &S Gary Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #316",
                "am": "6:40",
                "pm": "2:45"
            }
        ],
        "lon": -111.91469,
        "lat": 33.419446
    },
    {
        "school": "McClintock",
        "name": "E Lilac Dr & N Bridalwreath St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #305",
                "am": "6:40",
                "pm": "2:55"
            }
        ],
        "lon": -111.922225,
        "lat": 33.448755
    },
    {
        "school": "McClintock",
        "name": "E McArthur Dr & S George Dr",
        "detail": "at Esquer Park",
        "program": null,
        "runs": [
            {
                "route": "Route #302",
                "am": "6:42",
                "pm": "2:45"
            }
        ],
        "lon": -111.887478,
        "lat": 33.416617
    },
    {
        "school": "McClintock",
        "name": "E. Freemont Dr & E Frost Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #316",
                "am": "6:16",
                "pm": "3:00"
            }
        ],
        "lon": -111.920697,
        "lat": 33.381549
    },
    {
        "school": "McClintock",
        "name": "N Harold St & E Tempe Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #305",
                "am": "6:45",
                "pm": "2:50"
            }
        ],
        "lon": -111.922178,
        "lat": 33.44224
    },
    {
        "school": "McClintock",
        "name": "N La Rosa Dr & E Marigold Ln",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #305",
                "am": "6:35",
                "pm": "3:00"
            }
        ],
        "lon": -111.931651,
        "lat": 33.448298
    },
    {
        "school": "McClintock",
        "name": "N May & Dartmouth Trace Apts",
        "detail": "near parking lot entrance on May",
        "program": null,
        "runs": [
            {
                "route": "Route #302",
                "am": "6:50",
                "pm": "2:51"
            }
        ],
        "lon": null,
        "lat": null,
        "unlocated": true
    },
    {
        "school": "McClintock",
        "name": "S Evergreen Rd & W University Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #302",
                "am": "6:47",
                "pm": "2:48"
            }
        ],
        "lon": -111.88302,
        "lat": 33.422096
    },
    {
        "school": "Mountain Pointe",
        "name": "27th Ave & Baseline",
        "detail": "southwest corner",
        "program": "OPEN ENROLLMENT South MTN area",
        "runs": [
            {
                "route": "Route #331",
                "am": "6:45",
                "pm": "3:45"
            }
        ],
        "lon": -112.116472,
        "lat": 33.37766
    },
    {
        "school": "Mountain Pointe",
        "name": "51st Ave & Pecos Rd/Boys & Girls Club",
        "detail": null,
        "program": "NATIVE AMERICAN PROGAM ONLY (must be registered in program)",
        "runs": [
            {
                "route": "Route #334",
                "am": "7:00",
                "pm": "3:35"
            }
        ],
        "lon": -112.16908,
        "lat": 33.290473
    },
    {
        "school": "Mountain Pointe",
        "name": "83rd Ave & Baseline Rd/Community Center",
        "detail": null,
        "program": "NATIVE AMERICAN PROGAM ONLY (must be registered in program)",
        "runs": [
            {
                "route": "Route #334",
                "am": "Call 480-345-3781",
                "pm": "Call 480-345-3781"
            }
        ],
        "lon": -112.237051,
        "lat": 33.377298
    },
    {
        "school": "Mountain Pointe",
        "name": "Butterfield Pkwy & Jynna Dr.",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #330",
                "am": "6:30",
                "pm": "3:40"
            }
        ],
        "lon": -112.040811,
        "lat": 33.066548
    },
    {
        "school": "Mountain Pointe",
        "name": "Butterfield Pkwy & W McClelland Dr",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #330",
                "am": "6:25",
                "pm": "3:45"
            }
        ],
        "lon": -112.034038,
        "lat": 33.062306
    },
    {
        "school": "Mountain Pointe",
        "name": "Cobblestone Farm Dr. @ North Roundabout",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #328",
                "am": "6:30",
                "pm": "3:40"
            }
        ],
        "lon": -112.038385,
        "lat": 33.083862,
        "approximate": true
    },
    {
        "school": "Mountain Pointe",
        "name": "Desert Cedars Dr & Mescal St",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #328",
                "am": "6:20",
                "pm": "3:50"
            }
        ],
        "lon": -112.042587,
        "lat": 33.046011
    },
    {
        "school": "Mountain Pointe",
        "name": "E Equestrian Trail & S Tonalea Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:25",
                "pm": "3:15"
            }
        ],
        "lon": -112.003357,
        "lat": 33.335802
    },
    {
        "school": "Mountain Pointe",
        "name": "E Jicarilla St & S Bannock St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:22",
                "pm": "3:20"
            }
        ],
        "lon": -111.990401,
        "lat": 33.347773
    },
    {
        "school": "Mountain Pointe",
        "name": "E Vineyard Rd & S 14th St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "7:00",
                "pm": "Use RT # 335"
            }
        ],
        "lon": -112.051642,
        "lat": 33.384997
    },
    {
        "school": "Mountain Pointe",
        "name": "E Vineyard Rd & S 14th St",
        "detail": "sw corner",
        "program": "OPEN ENROLLMENT South MTN area",
        "runs": [
            {
                "route": "Route #335",
                "am": "Use RT #321",
                "pm": "3:35"
            }
        ],
        "lon": -112.051642,
        "lat": 33.384997
    },
    {
        "school": "Mountain Pointe",
        "name": "E Winston Dr & Patricia St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "6:50",
                "pm": "3:35"
            }
        ],
        "lon": -112.026764,
        "lat": 33.36881
    },
    {
        "school": "Mountain Pointe",
        "name": "E. Beverly Rd & Pointe PKWY W",
        "detail": "SW corner",
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "7:05",
                "pm": "3:25"
            }
        ],
        "lon": -111.9739,
        "lat": 33.374605
    },
    {
        "school": "Mountain Pointe",
        "name": "Jesse Owens Parkway & 7th St",
        "detail": "On Jesse Owens between Olympic & 7th St",
        "program": "OPEN ENROLLMENT South MTN area",
        "runs": [
            {
                "route": "Route #335",
                "am": "7:00",
                "pm": "3:45"
            }
        ],
        "lon": -112.065994,
        "lat": 33.374157
    },
    {
        "school": "Mountain Pointe",
        "name": "N Dustin Ln & N McKemy Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:18",
                "pm": "3:23"
            }
        ],
        "lon": -111.953376,
        "lat": 33.317597
    },
    {
        "school": "Mountain Pointe",
        "name": "N Gabriel Path & W Kristal Ln",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #330",
                "am": "6:20",
                "pm": "3:50"
            }
        ],
        "lon": -112.035056,
        "lat": 33.053888
    },
    {
        "school": "Mountain Pointe",
        "name": "N Porter Rd & Pacana Park",
        "detail": "by baseball field",
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #330",
                "am": "6:15",
                "pm": "3:55"
            }
        ],
        "lon": -112.013556,
        "lat": 33.059714,
        "approximate": true
    },
    {
        "school": "Mountain Pointe",
        "name": "N Roosevelt Ave & Alamendras St",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #328",
                "am": "6:25",
                "pm": "3:45"
            }
        ],
        "lon": -112.054198,
        "lat": 33.071185
    },
    {
        "school": "Mountain Pointe",
        "name": "N Van Loo Dr & W Bravo Dr",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #329",
                "am": "6:30",
                "pm": "3:43"
            }
        ],
        "lon": -112.021012,
        "lat": 33.079651
    },
    {
        "school": "Mountain Pointe",
        "name": "Rancho El Dorado Pkwy & Lake Vista Dr",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #329",
                "am": "6:35",
                "pm": "3:40"
            }
        ],
        "lon": -112.036695,
        "lat": 33.081803
    },
    {
        "school": "Mountain Pointe",
        "name": "S 28th St. & E South Mountain Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "6:52",
                "pm": "3:38"
            }
        ],
        "lon": -112.023071,
        "lat": 33.370691
    },
    {
        "school": "Mountain Pointe",
        "name": "S 41st St. & E Ridge Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #321",
                "am": "7:15",
                "pm": "3:25"
            }
        ],
        "lon": -111.994983,
        "lat": 33.379874
    },
    {
        "school": "Mountain Pointe",
        "name": "S 44th St & E Fremont St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #311",
                "am": "7:20",
                "pm": "3:27"
            }
        ],
        "lon": -111.987001,
        "lat": 33.38139
    },
    {
        "school": "Mountain Pointe",
        "name": "S 44th St. & E Sunrise Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:19",
                "pm": "3:25"
            }
        ],
        "lon": -111.98882,
        "lat": 33.353667
    },
    {
        "school": "Mountain Pointe",
        "name": "S 45th Pl & E Mineral Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #306",
                "am": "7:17",
                "pm": "3:27"
            }
        ],
        "lon": -111.983484,
        "lat": 33.356711
    },
    {
        "school": "Mountain Pointe",
        "name": "S 46th Place & E White Aster",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:28",
                "pm": "3:15"
            }
        ],
        "lon": -111.984478,
        "lat": 33.31003
    },
    {
        "school": "Mountain Pointe",
        "name": "S 47th Pl & E Piedmont Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "7:23",
                "pm": "3:27"
            }
        ],
        "lon": -111.977024,
        "lat": 33.359872
    },
    {
        "school": "Mountain Pointe",
        "name": "S 48th Place & E Western Star Blvd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "7:18",
                "pm": "3:22"
            }
        ],
        "lon": -111.979428,
        "lat": 33.352258
    },
    {
        "school": "Mountain Pointe",
        "name": "S 51st St & E Piedmont Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #312",
                "am": "7:27",
                "pm": "3:30"
            }
        ],
        "lon": -111.974761,
        "lat": 33.358142
    },
    {
        "school": "Mountain Pointe",
        "name": "S Dromedary Dr & W Palomino Dr.",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:09",
                "pm": "3:28"
            }
        ],
        "lon": -111.943499,
        "lat": 33.338652
    },
    {
        "school": "Mountain Pointe",
        "name": "S Elm St & W Mercury Way",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:10",
                "pm": "3:25"
            }
        ],
        "lon": -111.938458,
        "lat": 33.302546
    },
    {
        "school": "Mountain Pointe",
        "name": "S Kyrene Rd & W Verde Ln",
        "detail": "previously Stephanie & Verde, at the Alisanos neighborhood",
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:13",
                "pm": "3:31"
            }
        ],
        "lon": -111.945761,
        "lat": 33.344677
    },
    {
        "school": "Mountain Pointe",
        "name": "S Priest Dr & W Greentree Dr",
        "detail": "West side of Priest @ San Sonoma Apts",
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:20",
                "pm": "3:15"
            }
        ],
        "lon": -111.963116,
        "lat": 33.33171
    },
    {
        "school": "Mountain Pointe",
        "name": "S. Cavendish Way & W. Fremont Rd",
        "detail": null,
        "program": "OPEN ENROLLMENT South MTN area",
        "runs": [
            {
                "route": "Route #334",
                "am": "6:45",
                "pm": "3:45"
            }
        ],
        "lon": -112.175964,
        "lat": 33.382229
    },
    {
        "school": "Mountain Pointe",
        "name": "South Mtn. Ave & S 20th Pl",
        "detail": "Northeast side",
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "6:55",
                "pm": "3:43"
            }
        ],
        "lon": -112.03928,
        "lat": 33.370492
    },
    {
        "school": "Mountain Pointe",
        "name": "Vera Cruz Dr & N. Rancho Mirage Blvd",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #329",
                "am": "6:15",
                "pm": "3:55"
            }
        ],
        "lon": -111.971118,
        "lat": 33.056744
    },
    {
        "school": "Mountain Pointe",
        "name": "W Bowlin Rd. & N Alterra Pkwy",
        "detail": "at retention basin just east of Maricopa Elementary",
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #328",
                "am": "6:15",
                "pm": "3:55"
            }
        ],
        "lon": -112.053455,
        "lat": 33.043745
    },
    {
        "school": "Mountain Pointe",
        "name": "W Frye Rd & S Oak St",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #314",
                "am": "7:13",
                "pm": "3:28"
            }
        ],
        "lon": -111.941656,
        "lat": 33.296777
    },
    {
        "school": "Mountain Pointe",
        "name": "W Harrison St & N Wyatt Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:28",
                "pm": "3:15"
            }
        ],
        "lon": -111.960881,
        "lat": 33.316247
    },
    {
        "school": "Mountain Pointe",
        "name": "W Larona Ln & S Beck Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:28",
                "pm": "3:21"
            }
        ],
        "lon": -111.959139,
        "lat": 33.323684
    },
    {
        "school": "Mountain Pointe",
        "name": "W Oakland St & N Roosevelt Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:15",
                "pm": "3:25"
            }
        ],
        "lon": -111.949278,
        "lat": 33.311353
    },
    {
        "school": "Mountain Pointe",
        "name": "W Orchid Ln @ N Allison Way",
        "detail": "opposite the condos exit on Orchid Ln",
        "program": null,
        "runs": [
            {
                "route": "Route #337",
                "am": "7:23",
                "pm": "3:18"
            }
        ],
        "lon": -111.964519,
        "lat": 33.323582
    },
    {
        "school": "Mountain Pointe",
        "name": "W Orchid Ln & N McKemy Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #309",
                "am": "7:23",
                "pm": "3:20"
            }
        ],
        "lon": -111.953345,
        "lat": 33.323578
    },
    {
        "school": "Mountain Pointe",
        "name": "W. Homestead Dr & N. Continental Blvd",
        "detail": null,
        "program": "OPEN ENROLLMENT Maricopa",
        "runs": [
            {
                "route": "Route #329",
                "am": "6:20",
                "pm": "3:48"
            }
        ],
        "lon": -112.00058,
        "lat": 33.06123,
        "approximate": true
    },
    {
        "school": "Mountain Pointe",
        "name": "W. Vander Way & S. 54th Dr",
        "detail": null,
        "program": "OPEN ENROLLMENT South MTN area",
        "runs": [
            {
                "route": "Route #327",
                "am": "6:45",
                "pm": "4:00"
            }
        ],
        "lon": -112.175097,
        "lat": 33.394535
    },
    {
        "school": "Tempe High",
        "name": "20th Pl. & South Mountain",
        "detail": null,
        "program": "OPEN ENROLLMENT STOPS",
        "runs": [
            {
                "route": "Route #317",
                "am": "7:45",
                "pm": "4:10"
            }
        ],
        "lon": -112.03928,
        "lat": 33.370492
    },
    {
        "school": "Tempe High",
        "name": "22nd St & Carver Dr",
        "detail": "O.E.",
        "program": null,
        "runs": [
            {
                "route": "Route #323",
                "am": "7:50",
                "pm": "22nd St. & Carver"
            }
        ],
        "lon": -112.036363,
        "lat": 33.403549,
        "approximate": true
    },
    {
        "school": "Tempe High",
        "name": "41st St. & Hidalgo Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #302",
                "am": "7:55",
                "pm": "4:00"
            }
        ],
        "lon": -111.992805,
        "lat": 33.394416
    },
    {
        "school": "Tempe High",
        "name": "41st St. & Nancy Lane",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #305",
                "am": "7:50",
                "pm": "3:55"
            }
        ],
        "lon": -111.993438,
        "lat": 33.390732
    },
    {
        "school": "Tempe High",
        "name": "42nd St. & Vineyard Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #302",
                "am": "7:50",
                "pm": "3:55"
            }
        ],
        "lon": -111.991352,
        "lat": 33.385804
    },
    {
        "school": "Tempe High",
        "name": "44th Pl. & Roeser Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #323",
                "am": "8:00",
                "pm": "3:50"
            }
        ],
        "lon": -111.986464,
        "lat": 33.399815
    },
    {
        "school": "Tempe High",
        "name": "46th Pl & Apollo Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #316",
                "am": "7:57",
                "pm": "3:53"
            }
        ],
        "lon": -111.98234,
        "lat": 33.387364
    },
    {
        "school": "Tempe High",
        "name": "46th Pl & Broadway Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #304",
                "am": "8:05",
                "pm": "4:05"
            }
        ],
        "lon": -111.978289,
        "lat": 33.407327
    },
    {
        "school": "Tempe High",
        "name": "46th Pl. & Pecan Rd",
        "detail": "On Pecan at vacant Lot",
        "program": null,
        "runs": [
            {
                "route": "Route #305",
                "am": "7:55",
                "pm": "3:50"
            }
        ],
        "lon": -111.981848,
        "lat": 33.395165
    },
    {
        "school": "Tempe High",
        "name": "46th St. & Burgess Lane",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #316",
                "am": "7:55",
                "pm": "3:50"
            }
        ],
        "lon": -111.983063,
        "lat": 33.390079
    },
    {
        "school": "Tempe High",
        "name": "Calle los Cerros & Fremont",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "7:58",
                "pm": "RT 316"
            },
            {
                "route": "Route #316",
                "am": "RT 301",
                "pm": "4:00"
            }
        ],
        "lon": -111.934176,
        "lat": 33.382134,
        "approximate": true
    },
    {
        "school": "Tempe High",
        "name": "College Ave & Dunbar Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "7:55",
                "pm": "RT #303"
            },
            {
                "route": "Route #325",
                "am": "RT 315",
                "pm": "3:55"
            }
        ],
        "lon": -111.935215,
        "lat": 33.379707
    },
    {
        "school": "Tempe High",
        "name": "E Maldonado Dr & S 14th St.",
        "detail": "just south of Vineyard",
        "program": "OPEN ENROLLMENT STOPS",
        "runs": [
            {
                "route": "Route #317",
                "am": "7:52",
                "pm": "4:00"
            }
        ],
        "lon": -112.051656,
        "lat": 33.383263
    },
    {
        "school": "Tempe High",
        "name": "Kyrene Rd & Baseline Rd",
        "detail": "inside M.H.P. off Kyrene by park",
        "program": null,
        "runs": [
            {
                "route": "Route #325",
                "am": "8:05",
                "pm": "4:02"
            }
        ],
        "lon": -111.943885,
        "lat": 33.378208
    },
    {
        "school": "Tempe High",
        "name": "Manhatton Dr & Cutler Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "RT 315",
                "pm": "4:05"
            },
            {
                "route": "Route #315",
                "am": "8:10",
                "pm": "4:13"
            }
        ],
        "lon": -111.958788,
        "lat": 33.388834
    },
    {
        "school": "Tempe High",
        "name": "Park Dr. & Vineyard Rd",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "7:55",
                "pm": "RT 316"
            },
            {
                "route": "Route #316",
                "am": "RT 301",
                "pm": "3:58"
            }
        ],
        "lon": -111.976621,
        "lat": 33.385481
    },
    {
        "school": "Tempe High",
        "name": "Priest Dr & Southern Ave",
        "detail": "in Petersen House parking lot",
        "program": "OPEN ENROLLMENT STOPS",
        "runs": [
            {
                "route": "Route #301",
                "am": "8:10",
                "pm": "RT 317"
            },
            {
                "route": "Route #317",
                "am": "RT 301",
                "pm": "3:55"
            }
        ],
        "lon": -111.960762,
        "lat": 33.392843
    },
    {
        "school": "Tempe High",
        "name": "Rancho Tempe M.H.P",
        "detail": "east side of park",
        "program": null,
        "runs": [
            {
                "route": "Route #301",
                "am": "RT 315",
                "pm": "4:00"
            },
            {
                "route": "Route #315",
                "am": "8:05",
                "pm": "4:08"
            }
        ],
        "lon": -111.954513,
        "lat": 33.361367
    },
    {
        "school": "Tempe High",
        "name": "Terry Lane & Dunbar Dr",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #315",
                "am": "8:02",
                "pm": "RT #325"
            },
            {
                "route": "Route #325",
                "am": "RT 315",
                "pm": "4:10"
            }
        ],
        "lon": -111.955391,
        "lat": 33.379474
    },
    {
        "school": "Tempe High",
        "name": "W 2nd St & S Beck Ave",
        "detail": null,
        "program": null,
        "runs": [
            {
                "route": "Route #304",
                "am": "7:50",
                "pm": "3:55"
            }
        ],
        "lon": -111.956695,
        "lat": 33.427803
    }
];
