import pandas as pd
import os


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

    # Remove rows with empty values in GPSELEVATION column
    clean_data = clean_data[clean_data['GPSELEVATION'].notna()]

    # If we want to drop all rows with null (not sure if we have to)
    # clean_data = clean_data.dropna()

    # Create a new CSV for each unique route
    os.mkdir('routes')
    routes = clean_data.groupby(['SHOVEL_ID', 'DUMP_ID'])
    for route, data in routes:
        data.to_csv(f'routes\\ROUTE_{route[0]}_{route[1]}.csv', index=False)

    os.mkdir('truck_type')
    for truck_type, data in clean_data.groupby('TRUCK_TYPE_ID'):
        data.to_csv(f'truck_type\\type_{truck_type}.csv', index=False)

    test_set = clean_data.loc[clean_data['TRUCK_ID'] == 3 & clean_data['SHOVEL_ID'] == 0 & clean_data['DUMP_ID'] == 0]
    test_set.to_csv('test_set.csv', index=False)

    training_set = clean_data.loc[clean_data['TRUCK_ID'] != 3 & clean_data['SHOVEL_ID'] != 0 & clean_data['DUMP_ID'] != 0]
    training_set.to_csv('training_set.csv', index=False)


def main():
    clean()


if __name__ == '__main__':
    main()
