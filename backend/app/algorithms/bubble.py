def generate_actions(array, sort_direction="asc"):
    # Generate actions for the bubble sort algorithm
    actions = []
    arr = array.copy()
    n = len(arr)

    for i in range(n):
        for j in range(0, n-i - 1):
            # Record the comparsion action
            actions.append({
                "type": "compare",
                "positions": [j, j + 1],
                "values": [arr[j], arr[j + 1]]
            })

            # If element is in wrong order, swap them
            should_swap = (sort_direction == "asc" and arr[j] > arr[j + 1]) or \
                         (sort_direction == "desc" and arr[j] < arr[j + 1])
            
            if should_swap:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

                # Record the swap action
                actions.append({
                    "type": "swap",
                    "positions": [j, j + 1],
                    "values": [arr[j], arr[j + 1]]
                })

    return actions