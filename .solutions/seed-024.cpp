#include <bits/stdc++.h>
using namespace std;

struct Team {
    string name;
    int score;
    int minutes;
};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    cin >> n;
    vector<Team> teams(n);
    for (auto &t : teams) cin >> t.name >> t.score >> t.minutes;
    sort(teams.begin(), teams.end(), [](const Team &a, const Team &b) {
        if (a.score != b.score) return a.score > b.score;       // 점수 높은 팀 먼저
        if (a.minutes != b.minutes) return a.minutes < b.minutes; // 빨리 끝낸 팀 먼저
        return a.name < b.name;                                   // 이름 사전 순
    });
    for (const auto &t : teams) cout << t.name << '\n';
}
