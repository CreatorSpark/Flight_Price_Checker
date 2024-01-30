import pandas as pd
import pickle
import sys
import json


# Load the model
model = pickle.load(open("flight_price_rf.pkl", "rb"))


def predict_flight_price(
    departure_time, arrival_time, total_stops, airline, source, destination
):
    # Extracting journey day and month
    Journey_day = int(pd.to_datetime(departure_time, format="%Y-%m-%dT%H:%M").day)
    Journey_month = int(pd.to_datetime(departure_time, format="%Y-%m-%dT%H:%M").month)

    # Extracting departure hour and minute
    Dep_hour = int(pd.to_datetime(departure_time, format="%Y-%m-%dT%H:%M").hour)
    Dep_min = int(pd.to_datetime(departure_time, format="%Y-%m-%dT%H:%M").minute)

    # Extracting arrival hour and minute
    Arrival_hour = int(pd.to_datetime(arrival_time, format="%Y-%m-%dT%H:%M").hour)
    Arrival_min = int(pd.to_datetime(arrival_time, format="%Y-%m-%dT%H:%M").minute)

    # Calculating duration hour and minute
    dur_hour = abs(Arrival_hour - Dep_hour)
    dur_min = abs(Arrival_min - Dep_min)

    # One-hot encoding for airlines
    # Note: You need to add all possible airlines here as per your training data
    airlines = {
        "Jet Airways": 0,
        "IndiGo": 0,
        "Air India": 0,
        "Multiple carriers": 0,
        "SpiceJet": 0,
        "Vistara": 0,
        "GoAir": 0,
        "Multiple carriers Premium economy": 0,
        "Jet Airways Business": 0,
        "Vistara Premium economy": 0,
        "Trujet": 0,
    }
    if airline in airlines:
        airlines[airline] = 1

    # One-hot encoding for source
    # Note: Add all possible sources as per your training data
    sources = {"Delhi": 0, "Kolkata": 0, "Mumbai": 0, "Chennai": 0}
    if source in sources:
        sources[source] = 1

    # One-hot encoding for destination
    # Note: Add all possible destinations as per your training data
    destinations = {
        "Cochin": 0,
        "Delhi": 0,
        "New_Delhi": 0,
        "Hyderabad": 0,
        "Kolkata": 0,
    }
    if destination in destinations:
        destinations[destination] = 1

    # Prepare the model input array
    model_input = (
        [
            total_stops,
            Journey_day,
            Journey_month,
            Dep_hour,
            Dep_min,
            Arrival_hour,
            Arrival_min,
            dur_hour,
            dur_min,
        ]
        + list(airlines.values())
        + list(sources.values())
        + list(destinations.values())
    )

    # Make the prediction
    prediction = model.predict([model_input])
    return round(prediction[0], 2)


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])

    predicted_price = predict_flight_price(
        input_data["departure_time"],
        input_data["arrival_time"],
        input_data["total_stops"],
        input_data["airline"],
        input_data["source"],
        input_data["destination"],
    )

print(predicted_price)
