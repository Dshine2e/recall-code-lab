#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    vector<long long> h(n + 2, 0);
    for (int i = 1; i <= n; i++) scanf("%lld", &h[i]);
    // 한 번의 스택 순회: 막대를 꺼낼 때 그 막대를 최솟값으로 하는 구간을 확정한다.
    // 높이가 같은 막대는 같은 구간을 만들므로, 같은 높이를 만나면 앞의 것을 버리고 뒤의 것 하나만 남긴다.
    // 양 끝에 높이 0 보초를 둔다(1 ≤ h 이므로 보초는 항상 더 낮다).
    vector<int> st;
    st.push_back(0);
    long long best = 0, cnt = 0;
    for (int i = 1; i <= n + 1; i++) {
        while (h[st.back()] > h[i]) {
            int top = st.back();
            st.pop_back();
            long long width = i - st.back() - 1;
            long long area = h[top] * width;
            if (area > best) {
                best = area;
                cnt = 1;
            } else if (area == best) {
                cnt++;
            }
        }
        if (h[st.back()] == h[i]) st.pop_back();
        st.push_back(i);
    }
    printf("%lld\n%lld\n", best, cnt);
    return 0;
}
