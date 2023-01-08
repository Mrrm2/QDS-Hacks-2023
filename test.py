acceleration = 1 
speed = 0 
distance_travelled = 0

seconds = 10

# loop
for second in seconds: 
    distance_travelled += speed
    speed += acceleration
    print(f'speed: {speed}, acceleration: {acceleration}, distance_travelled: {distance_travelled}')
