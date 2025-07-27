export const useToast = () => {
  return {
    toast: (message: string) => console.log(message),
  };
};

export default useToast; // Add default export
