import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface WorkItem {
  id: string;
  title: string;
  author: string;
  category?: string;
  categoryColor?: string;
  description?: string;
  coverImage?: string;
  lastModified?: string;
  created?: string;
}

interface WorkCardProps {
  work: WorkItem;
  onRead: (workId: string) => void;
  onEdit: (workId: string) => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, onRead, onEdit }) => {
  const handleReadPress = () => {
    onRead(work.id);
  };

  const handleEditPress = () => {
    onEdit(work.id);
  };

  const getCategoryBackgroundColor = (color: string) => {
    switch (color) {
      case '#10b981':
        return '#dcfce7';
      case '#3b82f6':
        return '#dbeafe';
      case '#f59e0b':
        return '#fef3c7';
      case '#8b5cf6':
        return '#ede9fe';
      default:
        return '#e5e7eb';
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: work.categoryColor ?? '#e5e7eb' }]}> 
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{work.title}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.author}>作者：{work.author}</Text>
              <View style={[styles.categoryTag, { backgroundColor: getCategoryBackgroundColor(work.categoryColor ?? '') }]}> 
                <Text style={[styles.categoryText, { color: work.categoryColor ?? '#000' }]}>{work.category}</Text>
              </View>
            </View>
          </View>
          <View style={styles.coverContainer}>
            {work.coverImage ? (
              <Image source={{ uri: work.coverImage }} style={styles.coverImage} resizeMode="cover" />
            ) : null}
          </View>
        </View>

        {work.description ? (
          <Text style={styles.description} numberOfLines={2}>{work.description}</Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <View style={styles.dateRow}>
              <FontAwesome6 name="clock" size={12} color="#6b7280" style={styles.dateIcon} />
              <Text style={styles.dateText}>修改于{work.lastModified}</Text>
            </View>
            <View style={styles.dateRow}>
              <FontAwesome6 name="calendar" size={12} color="#6b7280" style={styles.dateIcon} />
              <Text style={styles.dateText}>创建于{work.created}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.readButton} onPress={handleReadPress} activeOpacity={0.8}>
              <FontAwesome6 name="book-open" size={12} color="#1f2937" style={styles.buttonIcon} />
              <Text style={styles.readButtonText}>阅读</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: work.categoryColor ?? '#6b7280' }]} onPress={handleEditPress} activeOpacity={0.8}>
              <FontAwesome6 name="pen-to-square" size={12} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WorkCard;
