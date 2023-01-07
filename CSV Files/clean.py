import pandas as pd


def clean():
    # Read in data
    all_data = pd.read_csv('AllDataCombined.csv')

    # Only keep rows in column STATUS that are equal to 'empty' or 'hauling'
    all_data = all_data[all_data['STATUS'].isin(['Empty', 'Hauling'])]

    # Remove RND column
    all_data = all_data.drop('RND', axis=1)

    # Remove PAYLOAD column
    all_data = all_data.drop('PAYLOAD', axis=1)

    # Drop first column
    all_data = all_data.drop(all_data.columns[0], axis=1)

    # Remove rows with empty values in FUEL_RATE column
    clean_data = all_data[all_data['FUEL_RATE'].notna()]

    # Save clean data to master CSV
    clean_data.to_csv('CleanData.csv', index=False)

    # Create a new CSV for each unique TRUCK_ID
    for truck_id in clean_data['TRUCK_ID'].unique():
        truck_data = clean_data[clean_data['TRUCK_ID'] == truck_id]
        truck_data.to_csv('Truck' + str(truck_id) + '.csv', index=False)


def main():
    clean()


if __name__ == '__main__':
    main()
