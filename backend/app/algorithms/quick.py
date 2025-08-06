def generate_actions(array, sort_direction="asc"):
    """Generate actions for the quick sort algorithm"""
    actions = []
    arr = array.copy()
    
    def quick_sort(arr, low, high):
        if low < high:
            # Partition the array and get the pivot index
            pivot_index = partition(arr, low, high)
            
            # Recursively sort elements before and after partition
            quick_sort(arr, low, pivot_index - 1)
            quick_sort(arr, pivot_index + 1, high)
    
    def partition(arr, low, high):
        # Choose the rightmost element as pivot
        pivot = arr[high]
        
        # Index of smaller element (indicates the right position of pivot)
        i = low - 1
        
        for j in range(low, high):
            # Record comparison action
            actions.append({
                "type": "compare",
                "positions": [j, high],  # Compare current element with pivot
                "values": [arr[j], pivot]
            })
            
            # If current element should be on left side of pivot
            should_be_left = (sort_direction == "asc" and arr[j] <= pivot) or \
                           (sort_direction == "desc" and arr[j] >= pivot)
            
            if should_be_left:
                i += 1
                # Swap elements if they're different positions
                if i != j:
                    arr[i], arr[j] = arr[j], arr[i]
                    actions.append({
                        "type": "swap",
                        "positions": [i, j],
                        "values": [arr[i], arr[j]]
                    })
        
        # Place pivot in correct position
        if i + 1 != high:
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            actions.append({
                "type": "swap",
                "positions": [i + 1, high],
                "values": [arr[i + 1], arr[high]]
            })
        
        return i + 1
    
    # Start the quick sort
    quick_sort(arr, 0, len(arr) - 1)
    
    return actions