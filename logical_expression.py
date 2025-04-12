from itertools import product
import random

# Dictionary mapping real-world actions to logical variables
ACTION_MAPPING = {
    'close': 'A',
    'open': 'A',
    'window': 'A',
    'switch': 'B',
    'on': 'B',
    'off': 'B',
    'fan': 'B',
    'light': 'C',
    'door': 'D',
    'lock': 'D',
    'unlock': 'D'
}

# List of food items for fridge inventory
FOOD_ITEMS = [
    'oat milk',
    'bread',
    'butter',
    'milk',
    'cold drinks',
    'eggs',
    'cheese',
    'yogurt',
    'juice',
    'vegetables',
    'fruits',
    'meat',
    'fish',
    'sauce',
    'jam'
]

# Dictionary mapping conditions to actions
CONDITION_ACTIONS = {
    'raining': {
        'actions': [
            'window is closed',
            'fan is switched on'
        ],
        'message': 'Since it is raining outside:'
    },
    'hot': {
        'actions': [
            'window is opened',
            'fan is switched on',
            'air conditioner is turned on'
        ],
        'message': 'Since it is hot:'
    },
    'cold': {
        'actions': [
            'window is closed',
            'heater is turned on'
        ],
        'message': 'Since it is cold:'
    },
    'night': {
        'actions': [
            'lights are turned on',
            'window is closed'
        ],
        'message': 'Since it is night:'
    },
    'morning': {
        'actions': [
            'window is opened',
            'lights are turned off'
        ],
        'message': 'Since it is morning:'
    },
    'sleeping': {
        'actions': [
            'lights are turned off',
            'windows are closed',
            'the alarm is set for 5 o\'clock',
            'air conditioner is turned on (if room temperature is above 28°C)'
        ],
        'message': 'Since you are going to sleep:'
    },
    'cooking': {
        'actions': [
            'Spotify shifts from lo-fi to energetic beats',
            'kitchen lights are adjusted to optimal brightness',
            'exhaust fan is turned on'
        ],
        'message': 'Since you are cooking:'
    },
    'fridge': {
        'actions': [
            f'Your {random.choice(FOOD_ITEMS)} expires tomorrow!',
            'suggesting recipes based on available ingredients',
            'displaying current temperature: 4°C'
        ],
        'message': 'Fridge Inventory Update:'
    }
}

def convert_to_logical_expression(text):
    """
    Convert natural language text to logical expression
    """
    words = text.lower().split()
    variables = set()
    expression = []
    
    for word in words:
        if word in ACTION_MAPPING:
            variables.add(ACTION_MAPPING[word])
            expression.append(ACTION_MAPPING[word])
        elif word == 'and':
            expression.append('AND')
        elif word == 'or':
            expression.append('OR')
        elif word == 'not':
            expression.append('NOT')
    
    return ' '.join(expression), list(variables)

def evaluate_expression(expression, values, variables):
    """
    Evaluate a logical expression with given variable values
    """
    # Create a local dictionary with variable values
    local_dict = dict(zip(variables, values))
    
    # Replace logical operators with Python operators
    expression = expression.replace('AND', 'and')
    expression = expression.replace('OR', 'or')
    expression = expression.replace('NOT', 'not')
    
    try:
        # Evaluate the expression using the local dictionary
        return eval(expression, {"__builtins__": {}}, local_dict)
    except:
        return None

def generate_truth_table(expression):
    """
    Generate a truth table for the given logical expression
    Returns a tuple of (variables, results) where results is a list of dictionaries
    containing the values and result for each combination
    """
    # Extract variables from the expression
    variables = sorted(set(var for var in expression.split() if var.isalpha() and var not in ['AND', 'OR', 'NOT']))
    
    if not variables:
        return [], []
    
    results = []
    # Generate all possible combinations of True/False for variables
    for values in product([True, False], repeat=len(variables)):
        result = evaluate_expression(expression, values, variables)
        if result is None:
            return [], []
        results.append({
            'values': values,
            'result': result
        })
    
    return variables, results

def get_action_result(expression, result):
    """
    Convert logical result to natural language action
    """
    if result:
        return "Action will be performed"
    return "Action will not be performed"

def process_user_input(text):
    """
    Process user input and return appropriate actions
    """
    text = text.lower().strip()
    
    # Check if any condition is mentioned in the input
    for condition, data in CONDITION_ACTIONS.items():
        if condition in text:
            # For fridge condition, generate new random food item each time
            if condition == 'fridge':
                data['actions'][0] = f'Your {random.choice(FOOD_ITEMS)} expires tomorrow!'
            return {
                'message': data['message'],
                'actions': data['actions']
            }
    
    # If no condition is found
    return {
        'error': 'No valid condition found. Try using words like: raining, hot, cold, night, morning, sleeping, cooking, fridge'
    }

def main():
    print("Logical Expression Truth Table Generator")
    print("Operators: AND, OR, NOT")
    print("Example: A AND B, A OR (NOT B)")
    
    while True:
        expression = input("\nEnter a logical expression (or 'quit' to exit): ")
        
        if expression.lower() == 'quit':
            break
            
        variables, results = generate_truth_table(expression)
        if not variables:
            print("No variables found in the expression.")
            continue
        
        # Print header
        print("\nTruth Table for:", expression)
        print("-" * 50)
        
        # Print variable names
        header = " | ".join(variables)
        print(f"{header} | Result")
        print("-" * 50)
        
        for result in results:
            # Print row
            values_str = " | ".join(str(int(v)) for v in result['values'])
            print(f"{values_str} | {int(result['result'])}")

if __name__ == "__main__":
    main() 