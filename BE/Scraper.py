from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from Q_division import q_div, q_div_sunday
import datetime
import re


class Scraper:

    def __init__(self):
        self.driver = None
        self.day_index = self.which_day()
        self.soup = None
        self.night_shifters = 0
        self.night_shifters_reset = 0
        self.schedule_dict_reset = {}
        self.schedule_dict = {}

    def login_process(self, username, password, company_code):
        try:
            options = Options()
            options.add_argument('headless')
            s = Service("path to the chromedriver")  # needs to be changed
            self.driver = webdriver.Chrome(service=s, options=options)
            self.driver.get('https://staff.ezshift.co.il/appfilesv3/loginHE-il.aspx')
            self.driver.find_element(by=By.ID, value='txtId').send_keys(username)
            self.driver.find_element(by=By.ID, value='txtPassword').send_keys(password)
            self.driver.find_element(by=By.ID, value='txtCompanyGroup').send_keys(company_code)
            self.driver.find_element(by=By.ID, value='ImageButton1').click()
            WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable((By.XPATH,
                                                                            '/html/body/form/center/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table/tbody/tr[1]/td[1]/table/tbody/tr[2]/td[2]'))).click()
            WebDriverWait(self.driver, 5).until(EC.frame_to_be_available_and_switch_to_it((By.ID, "frmTimePlan")))
            page_source = self.driver.page_source
            self.soup = BeautifulSoup(page_source, 'html.parser')
            if self.driver.find_element(by=By.ID, value='btnLogout') != 0:
                self.driver.close()
                return True
        except Exception as e:
            print(e)
            return False

    def scrape_and_create_schedule(self):
        table = self.soup.find('table', attrs={'id': 'tblByDays'})
        table_body = table.find('tbody')
        rows = table_body.find_all('tr')
        for i in range(1, len(rows), 1):
            title = rows[i].find_all('td', attrs={'class': 'RegularTitleCell'})[self.day_index]
            schedule = rows[i].find_all('td', attrs={'class': 'RegularScheduleCell'})[self.day_index]
            if ("Tier" in title.get_text() and schedule.get_text() != " ") or (
                    title.get_text() == "" and schedule.get_text() != " "):
                if self.day_index == 0 and title.get_text() == "" and schedule.get_text() == "":
                    continue
                self.night_shifters_counter(title.get_text())
                self.schedule_dict[i] = schedule.get_text()
                print(i)
                print(title.get_text())
                print(schedule.get_text())

                if "Night" in title.get_text():
                    break
        self.schedule_dict_reset = dict(self.schedule_dict)
        self.night_shifters_reset = self.night_shifters

    def delete_shifter(self, name):
        for key, values in self.schedule_dict.items():
            if values == name:
                del self.schedule_dict[key]
                break
        self.schedule_dict = dict(zip(list(range(1, len(self.schedule_dict) + 1)), self.schedule_dict.values()))

    def retrieve_info(self):
        self.schedule_dict = dict(self.schedule_dict_reset)
        self.night_shifters = self.night_shifters_reset

    def json_builder(self):
        id = list(self.schedule_dict.keys())
        name_list = list(self.schedule_dict.values())
        if self.day_index == 0:
            answer = [{"id": a, "time": b, "employee": c} for a, b, c in
                      zip(id, q_div_sunday[len(self.schedule_dict)], name_list)], self.night_shifters
        else:
            answer = [{"id": a, "time": b, "employee": c} for a, b, c in
                      zip(id, q_div["q_div" + str(len(self.schedule_dict)) + str(self.night_shifters)],
                          name_list)], self.night_shifters
        return answer

    def which_day(self):
        d = datetime.datetime.now()
        return int(d.strftime("%w"))

    def night_shifters_counter(self, time):
        if time != "":
            time = re.search("[0-9]+:[0-9]+", time).group()
        if time == "15:00":
            self.night_shifters += 1

    def check_schedule(self):
        if not self.schedule_dict:
            return False
        else:
            return True

