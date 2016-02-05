from abc import ABCMeta, abstractmethod
from pprint import pformat
from statistics import mean
from urllib.parse import quote

class Database(dict):
    def __new__(cls, entry_class):
        if 'finalize' in dir(entry_class):
            def _finalize(self):
                for name in self:
                    self[name].finalize()

            cls.finalize = _finalize
        return super().__new__(cls)

    def __init__(self, entry_class):
        super().__init__()
        self.known_aliases = {'FAT32': 'Разбор FAT32',
                              'ext4': 'Разбор ext4'}
        self._entry_class = entry_class

    def add_entry(self, data):
        name = data['name']
        name = self.known_aliases.get(name, name)
        if name not in self:
            self[name] = self._entry_class(data)
        self[name].update(data)


class Entry(metaclass=ABCMeta):
    @abstractmethod
    def __init__(self, data):
        pass

    @abstractmethod
    def update(self, data):
        pass

    def __str__(self):
        return str(self.__dict__)

    def __repr__(self):
        return pformat(self.__dict__, depth=1)


class EntryWithoutAnnotations(Entry):
    def __init__(self, data):
        self.average = 0
        self.categories = set()
        self.name = data['name']
        self.url_alias = self.get_url_alias()
        self.max = set()
        self.points = []
        self.students_amount = 0
        self.students_all_points = 0

    def update(self, data):
        self.max.add(data['max'])
        self.categories.add(data['category'])
        self.points += [(student['points'], data['max']) for student
                        in data['students']]

    def finalize(self):
        self.points = [elem for elem in self.points if elem[0]]
        self.students_amount = len(self.points)
        self.students_all_points = len([elem for elem in self.points
                                        if elem[0] == elem[1]])
        self.average = self.get_average([elem[0] for elem in self.points], 2)

    def get_url_alias(self):
        specific_names = {'bmp': 'bmp_stegano'}
        if self.name in specific_names:
            return quote(specific_names[self.name]) + '.html'
        return quote(self.name) + '.html'

    @staticmethod
    def get_average(iterable, precision=0):
        average = mean([elem for elem in iterable if elem] or [0])
        average = round(average, precision)
        if average.is_integer():
            return int(average)
        return average


class EntryWithPercentage(EntryWithoutAnnotations):
    def __init__(self, data):
        super().__init__(data)
        self.percents = []
        self.average_percent = 0

    def update(self, data):
        super().update(data)
        self.percents += [(student['points'] / data['max'] * 100) for
                          student in data['students']]

    def finalize(self):
        super().finalize()
        self.average_percent = self.get_average(self.percents)


class EntryFullInfo(EntryWithPercentage):
    def __init__(self, data):
        super().__init__(data)
        self.students = []

    def update(self, data):
        super().update(data)
        new__students = data['students']
        for student in new__students:
            student['max'] = data['max']
        self.students += new__students


class EntryOnlyAverageValues(EntryWithPercentage):
    def finalize(self):
        super().finalize()
        del self.points
        del self.percents
