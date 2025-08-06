def generate_actions(array, sort_direction="asc"):
    """Generate actions for the real merge sort algorithm with O(n log n) performance"""
    actions = []
    arr = array.copy()
    
    def merge_sort(arr, left, right):
        if left < right:
            # Find the middle point
            mid = (left + right) // 2
            
            # Recursively sort first and second halves
            merge_sort(arr, left, mid)
            merge_sort(arr, mid + 1, right)
            
            # Merge the sorted halves
            merge(arr, left, mid, right)
    
    def merge(arr, left, mid, right):
        """Merge two sorted sub-arrays using the traditional merge sort approach"""
        # Create temporary arrays for left and right sub-arrays
        left_arr = arr[left:mid + 1].copy()
        right_arr = arr[mid + 1:right + 1].copy()
        
        # Initial indices for left, right, and merged arrays
        i = 0  # Initial index of left sub-array
        j = 0  # Initial index of right sub-array
        k = left  # Initial index of merged sub-array
        
        # Merge the temporary arrays back into arr[left..right]
        while i < len(left_arr) and j < len(right_arr):
            # Compare elements from temporary sub-arrays (no position highlighting for merge sort)
            # Note: We don't show comparison highlighting because the elements being compared
            # are from temporary arrays, not current array positions
            
            # Choose the appropriate element based on sort direction
            should_choose_left = (sort_direction == "asc" and left_arr[i] <= right_arr[j]) or \
                               (sort_direction == "desc" and left_arr[i] >= right_arr[j])
            
            if should_choose_left:
                if arr[k] != left_arr[i]:  # Only generate visual action if changing
                    actions.append({
                        "type": "set",
                        "positions": [k],
                        "values": [left_arr[i]]
                    })
                arr[k] = left_arr[i]  # Always update array state
                i += 1
            else:
                if arr[k] != right_arr[j]:  # Only generate visual action if changing
                    actions.append({
                        "type": "set",
                        "positions": [k],
                        "values": [right_arr[j]]
                    })
                arr[k] = right_arr[j]  # Always update array state
                j += 1
            k += 1
        
        # Copy remaining elements of left_arr, if any
        while i < len(left_arr):
            if arr[k] != left_arr[i]:
                actions.append({
                    "type": "set",
                    "positions": [k],
                    "values": [left_arr[i]]
                })
            arr[k] = left_arr[i]  # Always update array state
            i += 1
            k += 1
        
        # Copy remaining elements of right_arr, if any
        while j < len(right_arr):
            if arr[k] != right_arr[j]:
                actions.append({
                    "type": "set",
                    "positions": [k],
                    "values": [right_arr[j]]
                })
            arr[k] = right_arr[j]  # Always update array state
            j += 1
            k += 1
    
    # Start the merge sort
    merge_sort(arr, 0, len(arr) - 1)
    
    return actions