import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginVertical: 15,
  },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 13,
    fontSize: 15,
    color: colors.text,
  },

  textArea: {
    minHeight: 130,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  secondaryButtonText: {
    color: colors.primaryDark,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },

  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 5,
  },

  successText: {
    color: colors.success,
    fontSize: 13,
    marginTop: 5,
  },
});

export default styles;