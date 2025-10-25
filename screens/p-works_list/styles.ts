

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newWorkButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  newWorkButtonIcon: {
    marginRight: 8,
  },
  newWorkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  welcomeBanner: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  welcomeBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeBannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  welcomeBannerTextContainer: {
    flex: 1,
  },
  welcomeBannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeBannerDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  tutorialButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  tutorialButtonIcon: {
    marginLeft: 4,
  },
  pageTitleSection: {
    marginBottom: 24,
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  worksList: {
    gap: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstWorkButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createFirstWorkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  createFirstWorkButtonIcon: {
    marginRight: 8,
  },
  createFirstWorkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

