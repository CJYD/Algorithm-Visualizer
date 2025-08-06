def generate_actions(array, sort_direction="asc"):
    """Generate actions for the selection sort algorithm"""
    actions = []
    arr = array.copy()
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n):
        # Find the minimum element in remaining unsorted array
        min_idx = i
        
        for j in range(i + 1, n):
            # Record comparison action
            actions.append({
                "type": "compare",
                "positions": [min_idx, j],
                "values": [arr[min_idx], arr[j]]
            })
            
            # Update min/max index based on sort direction
            should_update = (sort_direction == "asc" and arr[j] < arr[min_idx]) or \
                          (sort_direction == "desc" and arr[j] > arr[min_idx])
            
            if should_update:
                min_idx = j
        
        # Swap the found minimum element with the first element
        if min_idx != i:
            # Record swap action
            actions.append({
                "type": "swap",
                "positions": [i, min_idx],
                "values": [arr[i], arr[min_idx]]
            })
            
            # Perform the swap
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return actions