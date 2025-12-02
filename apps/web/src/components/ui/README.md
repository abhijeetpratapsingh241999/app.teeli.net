# LoginButton Component

## Description
The `LoginButton` component is a simple button designed for submitting the login form. It is styled with a `login-button` class and uses basic HTML form submission.

## Usage
To use the `LoginButton` component, import it and include it within your login form:

```jsx
import LoginButton from './LoginButton';

const LoginForm = () => {
  return (
    <form action="/login" method="POST">
      {/* Other form fields */}
      <LoginButton />
    </form>
  );
};

export default LoginForm;
```

## Props
This component does not accept any props.

## Styling
The button uses the `login-button` class for styling. Ensure you have the appropriate CSS defined for this class in your stylesheets.

## Notes
- This button is designed for basic HTML form submission without validation.
- For advanced functionality, consider extending this component with additional props or event handlers.