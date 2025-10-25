

import * as React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface FilterOption {
  value: string;
  label: string;
  color: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onClose: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedFilters,
  onFilterChange,
  onClose,
}) => {
  const handleOptionPress = (value: string) => {
    let newFilters: string[] = [];
    
    if (value === 'all') {
      // 当"全部作品"被选中时，只保留这一个选项
      newFilters = ['all'];
    } else {
      // 当其他选项被选中时，移除"全部作品"并切换当前选项
      newFilters = selectedFilters.filter(filter => filter !== 'all');
      if (newFilters.includes(value)) {
        newFilters = newFilters.filter(filter => filter !== value);
      } else {
        newFilters.push(value);
      }
      
      // 如果没有选中任何选项，默认选中"全部作品"
      if (newFilters.length === 0) {
        newFilters = ['all'];
      }
    }
    
    onFilterChange(newFilters);
  };

  const isOptionSelected = (value: string) => {
    return selectedFilters.includes(value);
  };

  return (
    <Modal
      transparent
      visible={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdown}>
          <Text style={styles.title}>作品分类</Text>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => handleOptionPress(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      isOptionSelected(option.value) && styles.checkboxSelected,
                      { borderColor: option.color },
                    ]}
                  >
                    {isOptionSelected(option.value) && (
                      <FontAwesome6
                        name="check"
                        size={12}
                        color="#ffffff"
                      />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterDropdown;

