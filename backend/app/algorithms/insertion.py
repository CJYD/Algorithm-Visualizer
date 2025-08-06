def generate_actions(array, sort_direction="asc"):
    """Generate actions for the insertion sort algorithm"""
    actions = []
    arr = array.copy()
    n = len(arr)
    
    # Traverse from the second element to the end
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        # Move elements of arr[0..i-1], that are greater than key,
        # one position ahead of their current position
        while j >= 0:
            # Record comparison action
            actions.append({
                "type": "compare",
                "positions": [j, j + 1],
                "values": [arr[j], arr[j + 1]]
            })
            
            # If current element should be moved based on sort direction
            should_move = (sort_direction == "asc" and arr[j] > arr[j + 1]) or \
                         (sort_direction == "desc" and arr[j] < arr[j + 1])
            
            if should_move:
                # Record swap action (moving element one position right)
                actions.append({
                    "type": "swap",
                    "positions": [j, j + 1],
                    "values": [arr[j], arr[j + 1]]
                })
                
                # Perform the swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                j -= 1
            else:
                # Found correct position, stop moving
                break
    
    return actions