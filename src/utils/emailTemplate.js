import sendMail from "./sendEmail";
export const sendBudgetAlertEmail = (email, name, budgetDetails) => {
  const {
    budgetName,
    currentSpent,
    budgetLimit,
    currency,
    overspentAmount,
    categoryName,
    periodEnd
  } = budgetDetails;

  const formattedCurrentSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(currentSpent);

  const formattedBudgetLimit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(budgetLimit);

  const formattedOverspent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(overspentAmount);

  const emailTemplate = {
    emailTo: email,
    subject: `⚠️ Budget Alert: ${budgetName} Limit Exceeded`,
    message: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="background-color: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 8px;">
          <h1 style="margin: 0;">Budget Alert</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
          <h2>Hello ${name},</h2>
          
          <p>This is to notify you that your budget <strong>${budgetName}</strong> has exceeded its limit.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
            <p style="margin: 5px 0;"><strong>Category:</strong> ${categoryName}</p>
            <p style="margin: 5px 0;"><strong>Current Spending:</strong> ${formattedCurrentSpent}</p>
            <p style="margin: 5px 0;"><strong>Budget Limit:</strong> ${formattedBudgetLimit}</p>
            <p style="margin: 5px 0; color: #ff6b6b;"><strong>Amount Exceeded:</strong> ${formattedOverspent}</p>
          </div>
          
          <p>Your budget period ends on ${new Date(periodEnd).toLocaleDateString()}. Consider taking the following actions:</p>
          
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0; padding-left: 24px; position: relative;">
              ✓ Review your recent transactions in this category
            </li>
            <li style="margin: 10px 0; padding-left: 24px; position: relative;">
              ✓ Adjust your spending for the remaining period
            </li>
            <li style="margin: 10px 0; padding-left: 24px; position: relative;">
              ✓ Modify your budget limit if needed
            </li>
          </ul>
          
          <p style="margin-top: 20px;">
            <a href="#" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Budget Details
            </a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <p>This is an automated message from your Wallet Management System.</p>
          <p>If you need any assistance, please reply to this email.</p>
        </div>
      </div>
    `
  };

  sendMail(emailTemplate);
};

// Example usage:
/*
sendBudgetAlertEmail("user@example.com", "John", {
  budgetName: "Monthly Expenses",
  currentSpent: 1200,
  budgetLimit: 1000,
  currency: "USD",
  overspentAmount: 200,
  categoryName: "Groceries",
  periodEnd: "2025-01-31"
});
*/
// When budget exceeds limit
// const budgetDetails = {
//     budgetName: budget.name,
//     currentSpent: totalSpent,
//     budgetLimit: budget.amount,
//     currency: budget.currency,
//     overspentAmount: totalSpent - budget.amount,
//     categoryName: category.name,
//     periodEnd: budget.endDate
//   };
  
//   sendBudgetAlertEmail(user.email, user.fullName, budgetDetails);
  