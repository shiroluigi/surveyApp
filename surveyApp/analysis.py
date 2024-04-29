import numpy as np
import statsmodels.api as sm
import json

# Sample JSON data
survey_data = {
}


# Function to calculate overall satisfaction
def calculate_overall_satisfaction(data):
    all_responses = []
    for qid in data:
        all_responses.extend(data[qid]["response"])
    return np.mean(all_responses)

# Function to perform ordinal regression analysis and calculate coefficients
def calculate_coefficients(data):
    coefficients = {}
    for qid in data:
        responses = data[qid]["response"]
        X = sm.add_constant(np.arange(1, len(responses) + 1))
        y = responses
        model = sm.OLS(y, X)  # Corrected here
        result = model.fit()
        coefficients[qid] = result.params[1]
    return coefficients

# Calculate overall satisfaction
overall_satisfaction = calculate_overall_satisfaction(survey_data)

# Calculate coefficients of impact for each question
impact_coefficients = calculate_coefficients(survey_data)

# Find the question with the highest coefficient
max_impact_question = max(impact_coefficients, key=impact_coefficients.get)

# Prepare JSON with question ID, question content, and coefficient of impact
result_json = {}
for qid in survey_data:
    responses = survey_data[qid]["response"]
    mean_response = np.mean(responses)
    result_json[qid] = {
        "question_content": survey_data[qid]["question_content"],
        "coefficient_of_impact": impact_coefficients[qid],
        "mean_response": mean_response
    }

# Print the JSON and overall satisfaction
print("JSON containing coefficients of impact for each question:")
print(json.dumps(result_json, indent=4))
print("\nOverall Satisfaction:", overall_satisfaction)
print("Question with the highest impact:", max_impact_question)